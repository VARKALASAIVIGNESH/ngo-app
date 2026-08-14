import csv
import io
from datetime import datetime, date
from flask import render_template, request, Response, flash, redirect, url_for
from flask_login import login_required
from app.reports import reports_bp
from app.models import Student, Feedback, Attendance, Session, User
from app.extensions import db


@reports_bp.route('/')
@login_required
def index():
    """Reports landing hub."""
    total_students = Student.query.count()
    total_sessions = Session.query.count()
    total_feedbacks = Feedback.query.count()
    total_attendance = Attendance.query.count()
    
    return render_template(
        'reports/index.html',
        total_students=total_students,
        total_sessions=total_sessions,
        total_feedbacks=total_feedbacks,
        total_attendance=total_attendance
    )


@reports_bp.route('/students')
@login_required
def student_report():
    """Individual Student Performance & Progress Report."""
    student_id = request.args.get('student_id', type=int)
    export_csv = request.args.get('export', '') == 'csv'
    
    students = Student.query.order_by(Student.full_name.asc()).all()
    selected_student = None
    feedbacks = []
    attendance_stats = None
    recent_attendances = []
    
    if student_id:
        selected_student = db.session.get(Student, student_id)
        if selected_student:
            feedbacks = selected_student.feedbacks.order_by(Feedback.feedback_date.desc()).all()
            attendance_stats = selected_student.attendance_stats
            recent_attendances = Attendance.query.filter_by(student_id=selected_student.id)\
                .join(Session, Attendance.session_id == Session.id)\
                .order_by(Session.date.desc()).all()
                
    if export_csv and selected_student:
        # Generate CSV for selected student feedback and attendance history
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Student Info Header
        writer.writerow(['NGO MANAGEMENT APPLICATION - STUDENT PERFORMANCE REPORT'])
        writer.writerow(['Generated Date', datetime.now().strftime('%Y-%m-%d %H:%M')])
        writer.writerow([])
        writer.writerow(['Student ID', selected_student.student_id])
        writer.writerow(['Full Name', selected_student.full_name])
        writer.writerow(['Grade / Class', selected_student.grade_class or 'N/A'])
        writer.writerow(['School', selected_student.school_name or 'N/A'])
        writer.writerow(['Status', selected_student.status])
        writer.writerow(['Average Rating', selected_student.average_rating or 'N/A'])
        writer.writerow(['Attendance %', f"{attendance_stats['percentage']}% ({attendance_stats['present']} Present, {attendance_stats['late']} Late, {attendance_stats['absent']} Absent)"])
        writer.writerow([])
        
        # Feedback Section
        writer.writerow(['FEEDBACK & EVALUATION HISTORY'])
        writer.writerow(['Date', 'Teacher', 'Subject/Area', 'Rating (1-5)', 'Rating Label', 'Attendance Obs', 'Academic Progress', 'Behaviour', 'Participation', 'Strengths', 'Improvement Areas', 'Comments'])
        for f in feedbacks:
            writer.writerow([
                f.feedback_date.strftime('%Y-%m-%d'),
                f.teacher.full_name if f.teacher else 'N/A',
                f.subject_area or '',
                f.rating,
                f.rating_label,
                f.attendance_obs or '',
                f.academic_progress or '',
                f.behaviour or '',
                f.participation or '',
                f.strengths or '',
                f.improvement_areas or '',
                f.comments or ''
            ])
            
        output.seek(0)
        filename = f"student_report_{selected_student.student_id}_{date.today().strftime('%Y%m%d')}.csv"
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment;filename={filename}"}
        )
        
    return render_template(
        'reports/student_report.html',
        students=students,
        selected_student=selected_student,
        feedbacks=feedbacks,
        attendance_stats=attendance_stats,
        recent_attendances=recent_attendances
    )


@reports_bp.route('/attendance')
@login_required
def attendance_report():
    """Comprehensive Attendance Report with entity and date range filters."""
    student_id = request.args.get('student_id', type=int)
    session_id = request.args.get('session_id', type=int)
    teacher_id = request.args.get('teacher_id', type=int)
    start_date_str = request.args.get('start_date', '').strip()
    end_date_str = request.args.get('end_date', '').strip()
    export_csv = request.args.get('export', '') == 'csv'
    
    query = Attendance.query.join(Session, Attendance.session_id == Session.id).join(Student, Attendance.student_id == Student.id)
    
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
        
    if session_id:
        query = query.filter(Attendance.session_id == session_id)
        
    if teacher_id:
        query = query.filter(Session.teacher_id == teacher_id)
        
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            query = query.filter(Session.date >= start_date)
        except ValueError:
            pass
            
    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            query = query.filter(Session.date <= end_date)
        except ValueError:
            pass
            
    records = query.order_by(Session.date.desc(), Student.full_name.asc()).all()
    
    # Calculate aggregate summary stats
    total_records = len(records)
    present_count = sum(1 for r in records if r.status == 'Present')
    late_count = sum(1 for r in records if r.status == 'Late')
    absent_count = sum(1 for r in records if r.status == 'Absent')
    effective_rate = round(((present_count + (0.5 * late_count)) / total_records * 100), 1) if total_records > 0 else 0.0
    
    summary = {
        'total': total_records,
        'present': present_count,
        'late': late_count,
        'absent': absent_count,
        'rate': effective_rate
    }
    
    if export_csv:
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['NGO MANAGEMENT APPLICATION - ATTENDANCE REPORT'])
        writer.writerow(['Generated Date', datetime.now().strftime('%Y-%m-%d %H:%M')])
        writer.writerow(['Summary', f"Total Records: {total_records}, Present: {present_count}, Late: {late_count}, Absent: {absent_count}, Overall Rate: {effective_rate}%"])
        writer.writerow([])
        writer.writerow(['Date', 'Session Title', 'Instructor', 'Student ID', 'Student Name', 'Class/Grade', 'Status', 'Remarks', 'Marked By'])
        
        for r in records:
            writer.writerow([
                r.session.date.strftime('%Y-%m-%d'),
                r.session.title,
                r.session.teacher.full_name if r.session.teacher else 'N/A',
                r.student.student_id,
                r.student.full_name,
                r.student.grade_class or 'N/A',
                r.status,
                r.remarks or '',
                r.marked_by.full_name if r.marked_by else 'N/A'
            ])
            
        output.seek(0)
        filename = f"attendance_report_{date.today().strftime('%Y%m%d')}.csv"
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment;filename={filename}"}
        )
        
    students = Student.query.order_by(Student.full_name.asc()).all()
    sessions = Session.query.order_by(Session.date.desc()).all()
    teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    
    return render_template(
        'reports/attendance_report.html',
        records=records,
        summary=summary,
        students=students,
        sessions=sessions,
        teachers=teachers,
        selected_student_id=student_id,
        selected_session_id=session_id,
        selected_teacher_id=teacher_id,
        start_date=start_date_str,
        end_date=end_date_str
    )


@reports_bp.route('/feedback')
@login_required
def feedback_report():
    """Comprehensive Feedback History Report with multi-parameter filtering."""
    student_id = request.args.get('student_id', type=int)
    teacher_id = request.args.get('teacher_id', type=int)
    rating = request.args.get('rating', type=int)
    start_date_str = request.args.get('start_date', '').strip()
    end_date_str = request.args.get('end_date', '').strip()
    export_csv = request.args.get('export', '') == 'csv'
    
    query = Feedback.query.join(Student, Feedback.student_id == Student.id)
    
    if student_id:
        query = query.filter(Feedback.student_id == student_id)
        
    if teacher_id:
        query = query.filter(Feedback.teacher_id == teacher_id)
        
    if rating:
        query = query.filter(Feedback.rating == rating)
        
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            query = query.filter(Feedback.feedback_date >= start_date)
        except ValueError:
            pass
            
    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            query = query.filter(Feedback.feedback_date <= end_date)
        except ValueError:
            pass
            
    records = query.order_by(Feedback.feedback_date.desc(), Feedback.id.desc()).all()
    
    # Summary calculation
    total_feedbacks = len(records)
    avg_rating = round(sum(r.rating for r in records) / total_feedbacks, 1) if total_feedbacks > 0 else 0.0
    
    if export_csv:
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['NGO MANAGEMENT APPLICATION - FEEDBACK HISTORY REPORT'])
        writer.writerow(['Generated Date', datetime.now().strftime('%Y-%m-%d %H:%M')])
        writer.writerow(['Total Feedback Records', total_feedbacks])
        writer.writerow(['Average Rating', avg_rating])
        writer.writerow([])
        writer.writerow(['Date', 'Student ID', 'Student Name', 'Teacher', 'Subject/Area', 'Rating (1-5)', 'Rating Label', 'Attendance Obs', 'Academic Progress', 'Behaviour', 'Participation', 'Strengths', 'Improvement Areas', 'Comments'])
        
        for f in records:
            writer.writerow([
                f.feedback_date.strftime('%Y-%m-%d'),
                f.student.student_id,
                f.student.full_name,
                f.teacher.full_name if f.teacher else 'N/A',
                f.subject_area or '',
                f.rating,
                f.rating_label,
                f.attendance_obs or '',
                f.academic_progress or '',
                f.behaviour or '',
                f.participation or '',
                f.strengths or '',
                f.improvement_areas or '',
                f.comments or ''
            ])
            
        output.seek(0)
        filename = f"feedback_report_{date.today().strftime('%Y%m%d')}.csv"
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment;filename={filename}"}
        )
        
    students = Student.query.order_by(Student.full_name.asc()).all()
    teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    
    return render_template(
        'reports/feedback_report.html',
        records=records,
        total_feedbacks=total_feedbacks,
        avg_rating=avg_rating,
        students=students,
        teachers=teachers,
        selected_student_id=student_id,
        selected_teacher_id=teacher_id,
        selected_rating=rating,
        start_date=start_date_str,
        end_date=end_date_str
    )

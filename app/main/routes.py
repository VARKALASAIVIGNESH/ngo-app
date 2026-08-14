from flask import render_template, redirect, url_for, jsonify
from flask_login import login_required, current_user
from sqlalchemy import func
from app.main import main_bp
from app.models import Student, User, Session, Attendance, Feedback
from app.extensions import db


@main_bp.route('/')
def root():
    """Root entry point: redirects to dashboard if authenticated, else login."""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    return redirect(url_for('auth.login'))


@main_bp.route('/dashboard')
@login_required
def dashboard():
    """Main application dashboard with key stats and activity feeds."""
    # Summary Counters
    total_students = Student.query.count()
    active_students = Student.query.filter_by(status='Active').count()
    total_staff = User.query.filter_by(role='teacher', is_active=True).count()
    total_sessions = Session.query.count()
    
    # Global Attendance Rate Calculation
    total_attendances = Attendance.query.count()
    present_attendances = Attendance.query.filter_by(status='Present').count()
    late_attendances = Attendance.query.filter_by(status='Late').count()
    absent_attendances = Attendance.query.filter_by(status='Absent').count()
    
    if total_attendances > 0:
        overall_attendance_pct = round(((present_attendances + (0.5 * late_attendances)) / total_attendances * 100), 1)
    else:
        overall_attendance_pct = 0.0

    # Recent Feedback (latest 5)
    recent_feedbacks = Feedback.query.order_by(Feedback.feedback_date.desc(), Feedback.id.desc()).limit(5).all()
    
    # Recent & Upcoming Sessions (latest 5)
    recent_sessions = Session.query.order_by(Session.date.desc(), Session.start_time.desc()).limit(5).all()
    
    # Recently Enrolled Students (latest 5)
    recent_students = Student.query.order_by(Student.created_at.desc()).limit(5).all()
    
    # Feedback Rating Distribution for Chart (Count of 1, 2, 3, 4, 5 stars)
    rating_counts = [0, 0, 0, 0, 0]  # indices 0-4 correspond to ratings 1-5
    for r in range(1, 6):
        cnt = Feedback.query.filter_by(rating=r).count()
        rating_counts[r - 1] = cnt
        
    # Attendance Breakdown for Donut Chart
    attendance_chart_data = {
        'Present': present_attendances,
        'Late': late_attendances,
        'Absent': absent_attendances
    }
    
    return render_template(
        'dashboard.html',
        total_students=total_students,
        active_students=active_students,
        total_staff=total_staff,
        total_sessions=total_sessions,
        overall_attendance_pct=overall_attendance_pct,
        total_attendances=total_attendances,
        recent_feedbacks=recent_feedbacks,
        recent_sessions=recent_sessions,
        recent_students=recent_students,
        rating_counts=rating_counts,
        attendance_chart_data=attendance_chart_data
    )

from flask import render_template, redirect, url_for, flash, request, current_app
from flask_login import login_required, current_user
from sqlalchemy import or_
from app.students import students_bp
from app.students.forms import StudentForm
from app.models import Student, Feedback, Attendance, Session
from app.extensions import db
from app.utils import admin_required, generate_student_id, save_profile_photo, calculate_age


@students_bp.route('/')
@login_required
def index():
    """List students with search, filtering, and pagination."""
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '').strip()
    grade_filter = request.args.get('grade', '').strip()
    
    query = Student.query
    
    # Search by Name, Student ID, School, Phone, or Parent
    if search:
        query = query.filter(
            or_(
                Student.full_name.ilike(f'%{search}%'),
                Student.student_id.ilike(f'%{search}%'),
                Student.school_name.ilike(f'%{search}%'),
                Student.phone.ilike(f'%{search}%'),
                Student.parent_name.ilike(f'%{search}%')
            )
        )
        
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    if grade_filter:
        query = query.filter(Student.grade_class.ilike(f'%{grade_filter}%'))
        
    # Get distinct classes for filter dropdown
    distinct_classes = [c[0] for c in db.session.query(Student.grade_class).distinct().all() if c[0]]
    
    pagination = query.order_by(Student.student_id.asc()).paginate(
        page=page,
        per_page=current_app.config.get('ITEMS_PER_PAGE', 10),
        error_out=False
    )
    
    return render_template(
        'students/list.html',
        pagination=pagination,
        students=pagination.items,
        search=search,
        status_filter=status_filter,
        grade_filter=grade_filter,
        distinct_classes=distinct_classes
    )


@students_bp.route('/new', methods=['GET', 'POST'])
@login_required
def create():
    """Register a new student."""
    form = StudentForm()
    
    # Pre-populate next generated student ID for display
    if request.method == 'GET':
        form.student_id.data = generate_student_id()
        
    if form.validate_on_submit():
        auto_id = generate_student_id()
        
        photo_filename = None
        if form.profile_photo.data:
            photo_filename = save_profile_photo(form.profile_photo.data)
            
        student = Student(
            student_id=auto_id,
            full_name=form.full_name.data.strip(),
            dob=form.dob.data,
            gender=form.gender.data,
            parent_name=form.parent_name.data.strip() if form.parent_name.data else None,
            phone=form.phone.data.strip() if form.phone.data else None,
            email=form.email.data.strip().lower() if form.email.data else None,
            address=form.address.data.strip() if form.address.data else None,
            joining_date=form.joining_date.data,
            grade_class=form.grade_class.data.strip() if form.grade_class.data else None,
            school_name=form.school_name.data.strip() if form.school_name.data else None,
            status=form.status.data,
            profile_photo=photo_filename,
            notes=form.notes.data.strip() if form.notes.data else None
        )
        
        db.session.add(student)
        db.session.commit()
        
        flash(f'Student "{student.full_name}" registered successfully with ID: {student.student_id}', 'success')
        return redirect(url_for('students.view', student_id=student.id))
        
    return render_template('students/form.html', form=form, title='Register New Student')


@students_bp.route('/<int:student_id>')
@login_required
def view(student_id):
    """View complete student profile, attendance summary, and feedback history."""
    student = Student.query.get_or_404(student_id)
    
    # Attendance stats
    attendance_stats = student.attendance_stats
    
    # Chronological feedback history (latest first)
    feedbacks = student.feedbacks.order_by(Feedback.feedback_date.desc()).all()
    
    # Recent attendances (latest 10)
    recent_attendances = Attendance.query.filter_by(student_id=student.id)\
        .join(Session, Attendance.session_id == Session.id)\
        .order_by(Session.date.desc())\
        .limit(10).all()
        
    # Feedback progress chart data (ordered chronologically)
    chart_feedbacks = student.feedbacks.order_by(Feedback.feedback_date.asc()).all()
    feedback_dates = [f.feedback_date.strftime('%b %d') for f in chart_feedbacks]
    feedback_ratings = [f.rating for f in chart_feedbacks]
    
    age = calculate_age(student.dob)
    
    return render_template(
        'students/view.html',
        student=student,
        attendance_stats=attendance_stats,
        feedbacks=feedbacks,
        recent_attendances=recent_attendances,
        feedback_dates=feedback_dates,
        feedback_ratings=feedback_ratings,
        age=age
    )


@students_bp.route('/<int:student_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(student_id):
    """Edit student details."""
    student = Student.query.get_or_404(student_id)
    form = StudentForm(obj=student)
    
    if form.validate_on_submit():
        student.full_name = form.full_name.data.strip()
        student.dob = form.dob.data
        student.gender = form.gender.data
        student.parent_name = form.parent_name.data.strip() if form.parent_name.data else None
        student.phone = form.phone.data.strip() if form.phone.data else None
        student.email = form.email.data.strip().lower() if form.email.data else None
        student.address = form.address.data.strip() if form.address.data else None
        student.joining_date = form.joining_date.data
        student.grade_class = form.grade_class.data.strip() if form.grade_class.data else None
        student.school_name = form.school_name.data.strip() if form.school_name.data else None
        student.status = form.status.data
        student.notes = form.notes.data.strip() if form.notes.data else None
        
        # Check if new photo was uploaded
        if form.profile_photo.data:
            new_photo = save_profile_photo(form.profile_photo.data)
            if new_photo:
                student.profile_photo = new_photo
                
        db.session.commit()
        flash(f'Student "{student.full_name}" profile updated successfully.', 'success')
        return redirect(url_for('students.view', student_id=student.id))
        
    return render_template('students/form.html', form=form, student=student, title=f'Edit Student: {student.full_name}')


@students_bp.route('/<int:student_id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(student_id):
    """Delete student record (Admin only)."""
    student = Student.query.get_or_404(student_id)
    name = student.full_name
    student_code = student.student_id
    
    db.session.delete(student)
    db.session.commit()
    
    flash(f'Student "{name}" ({student_code}) has been deleted along with all associated feedback and attendance records.', 'info')
    return redirect(url_for('students.index'))

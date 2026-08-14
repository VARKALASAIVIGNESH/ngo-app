from flask import render_template, redirect, url_for, flash, request, current_app
from flask_login import login_required, current_user
from app.feedback import feedback_bp
from app.feedback.forms import FeedbackForm
from app.models import Feedback, Student, User
from app.extensions import db


@feedback_bp.route('/')
@login_required
def index():
    """List all weekly feedback entries with filters."""
    page = request.args.get('page', 1, type=int)
    student_filter = request.args.get('student_id', type=int)
    teacher_filter = request.args.get('teacher_id', type=int)
    rating_filter = request.args.get('rating', type=int)
    
    query = Feedback.query
    
    if student_filter:
        query = query.filter_by(student_id=student_filter)
        
    if teacher_filter:
        query = query.filter_by(teacher_id=teacher_filter)
        
    if rating_filter:
        query = query.filter_by(rating=rating_filter)
        
    pagination = query.order_by(Feedback.feedback_date.desc(), Feedback.id.desc()).paginate(
        page=page,
        per_page=current_app.config.get('ITEMS_PER_PAGE', 10),
        error_out=False
    )
    
    all_students = Student.query.order_by(Student.full_name.asc()).all()
    all_teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    
    return render_template(
        'feedback/list.html',
        pagination=pagination,
        feedbacks=pagination.items,
        students=all_students,
        teachers=all_teachers,
        selected_student_id=student_filter,
        selected_teacher_id=teacher_filter,
        selected_rating=rating_filter
    )


@feedback_bp.route('/new', methods=['GET', 'POST'])
@login_required
def create():
    """Submit new weekly feedback for a student."""
    form = FeedbackForm()
    
    # Populate active students in dropdown
    students = Student.query.filter_by(status='Active').order_by(Student.full_name.asc()).all()
    if not students:
        # Fallback to all students if no active ones
        students = Student.query.order_by(Student.full_name.asc()).all()
        
    form.student_id.choices = [(s.id, f"{s.student_id} - {s.full_name} ({s.grade_class or 'N/A'})") for s in students]
    
    # Pre-select student from URL query parameter if present
    preselected_student_id = request.args.get('student_id', type=int)
    if request.method == 'GET' and preselected_student_id:
        form.student_id.data = preselected_student_id
        
    if form.validate_on_submit():
        feedback = Feedback(
            student_id=form.student_id.data,
            teacher_id=current_user.id,
            feedback_date=form.feedback_date.data,
            subject_area=form.subject_area.data.strip() if form.subject_area.data else None,
            attendance_obs=form.attendance_obs.data,
            rating=int(form.rating.data),
            academic_progress=form.academic_progress.data.strip() if form.academic_progress.data else None,
            behaviour=form.behaviour.data.strip() if form.behaviour.data else None,
            participation=form.participation.data.strip() if form.participation.data else None,
            strengths=form.strengths.data.strip() if form.strengths.data else None,
            improvement_areas=form.improvement_areas.data.strip() if form.improvement_areas.data else None,
            comments=form.comments.data.strip() if form.comments.data else None
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        student = db.session.get(Student, feedback.student_id)
        student_name = student.full_name if student else 'Student'
        flash(f'Weekly feedback submitted successfully for {student_name}.', 'success')
        return redirect(url_for('students.view', student_id=feedback.student_id))
        
    return render_template('feedback/form.html', form=form, title='Add Weekly Student Feedback')


@feedback_bp.route('/<int:feedback_id>')
@login_required
def view(feedback_id):
    """View a single feedback report."""
    feedback = Feedback.query.get_or_404(feedback_id)
    return render_template('feedback/view.html', feedback=feedback)


@feedback_bp.route('/<int:feedback_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(feedback_id):
    """Edit existing feedback (author or admin)."""
    feedback = Feedback.query.get_or_404(feedback_id)
    
    # Permission check: Only author teacher or admin can edit
    if not (current_user.is_admin or feedback.teacher_id == current_user.id):
        flash('You do not have permission to edit this feedback record.', 'danger')
        return redirect(url_for('feedback.index'))
        
    form = FeedbackForm(obj=feedback)
    
    students = Student.query.order_by(Student.full_name.asc()).all()
    form.student_id.choices = [(s.id, f"{s.student_id} - {s.full_name}") for s in students]
    
    if request.method == 'GET':
        form.rating.data = str(feedback.rating)
        
    if form.validate_on_submit():
        feedback.student_id = form.student_id.data
        feedback.feedback_date = form.feedback_date.data
        feedback.subject_area = form.subject_area.data.strip() if form.subject_area.data else None
        feedback.attendance_obs = form.attendance_obs.data
        feedback.rating = int(form.rating.data)
        feedback.academic_progress = form.academic_progress.data.strip() if form.academic_progress.data else None
        feedback.behaviour = form.behaviour.data.strip() if form.behaviour.data else None
        feedback.participation = form.participation.data.strip() if form.participation.data else None
        feedback.strengths = form.strengths.data.strip() if form.strengths.data else None
        feedback.improvement_areas = form.improvement_areas.data.strip() if form.improvement_areas.data else None
        feedback.comments = form.comments.data.strip() if form.comments.data else None
        
        db.session.commit()
        flash('Feedback entry updated successfully.', 'success')
        return redirect(url_for('feedback.view', feedback_id=feedback.id))
        
    return render_template('feedback/form.html', form=form, feedback=feedback, title='Edit Feedback')


@feedback_bp.route('/<int:feedback_id>/delete', methods=['POST'])
@login_required
def delete(feedback_id):
    """Delete feedback entry (author or admin)."""
    feedback = Feedback.query.get_or_404(feedback_id)
    
    if not (current_user.is_admin or feedback.teacher_id == current_user.id):
        flash('You do not have permission to delete this feedback record.', 'danger')
        return redirect(url_for('feedback.index'))
        
    student_id = feedback.student_id
    db.session.delete(feedback)
    db.session.commit()
    
    flash('Feedback record deleted successfully.', 'info')
    return redirect(url_for('students.view', student_id=student_id))

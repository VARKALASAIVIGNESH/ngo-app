from flask import render_template, redirect, url_for, flash, request, current_app
from flask_login import login_required, current_user
from datetime import datetime
from app.sessions import sessions_bp
from app.sessions.forms import SessionForm
from app.models import Session, Attendance, Student, User
from app.extensions import db


@sessions_bp.route('/')
@login_required
def index():
    """List sessions with filter and status options."""
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '').strip()
    teacher_filter = request.args.get('teacher_id', type=int)
    type_filter = request.args.get('type', '').strip()
    
    query = Session.query
    
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    if teacher_filter:
        query = query.filter_by(teacher_id=teacher_filter)
        
    if type_filter:
        query = query.filter_by(session_type=type_filter)
        
    pagination = query.order_by(Session.date.desc(), Session.start_time.desc()).paginate(
        page=page,
        per_page=current_app.config.get('ITEMS_PER_PAGE', 10),
        error_out=False
    )
    
    teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    
    return render_template(
        'sessions/list.html',
        pagination=pagination,
        sessions=pagination.items,
        teachers=teachers,
        selected_status=status_filter,
        selected_teacher_id=teacher_filter,
        selected_type=type_filter
    )


@sessions_bp.route('/new', methods=['GET', 'POST'])
@login_required
def create():
    """Create a new session."""
    form = SessionForm()
    
    # Teachers list
    teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    form.teacher_id.choices = [(t.id, f"{t.full_name} ({t.role.capitalize()})") for t in teachers]
    
    # Pre-select current user if teacher
    if request.method == 'GET':
        form.teacher_id.data = current_user.id
        
    if form.validate_on_submit():
        session_obj = Session(
            title=form.title.data.strip(),
            date=form.date.data,
            start_time=form.start_time.data,
            end_time=form.end_time.data,
            teacher_id=form.teacher_id.data,
            session_type=form.session_type.data,
            location=form.location.data.strip() if form.location.data else None,
            status=form.status.data,
            description=form.description.data.strip() if form.description.data else None
        )
        db.session.add(session_obj)
        db.session.commit()
        
        flash(f'Session "{session_obj.title}" created successfully.', 'success')
        return redirect(url_for('sessions.view', session_id=session_obj.id))
        
    return render_template('sessions/form.html', form=form, title='Schedule New Session')


@sessions_bp.route('/<int:session_id>')
@login_required
def view(session_id):
    """View session details, attendance stats, and marked attendance."""
    session_obj = Session.query.get_or_404(session_id)
    summary = session_obj.attendance_summary
    
    # Get all attendance records for this session
    attendance_records = Attendance.query.filter_by(session_id=session_obj.id)\
        .join(Student, Attendance.student_id == Student.id)\
        .order_by(Student.full_name.asc())\
        .all()
        
    return render_template(
        'sessions/view.html',
        session=session_obj,
        summary=summary,
        attendance_records=attendance_records
    )


@sessions_bp.route('/<int:session_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(session_id):
    """Edit session details."""
    session_obj = Session.query.get_or_404(session_id)
    
    # Permission check: admin or assigned teacher
    if not (current_user.is_admin or session_obj.teacher_id == current_user.id):
        flash('You do not have permission to modify this session.', 'danger')
        return redirect(url_for('sessions.view', session_id=session_obj.id))
        
    form = SessionForm(obj=session_obj)
    teachers = User.query.filter_by(is_active=True).order_by(User.full_name.asc()).all()
    form.teacher_id.choices = [(t.id, f"{t.full_name} ({t.role.capitalize()})") for t in teachers]
    
    if form.validate_on_submit():
        session_obj.title = form.title.data.strip()
        session_obj.date = form.date.data
        session_obj.start_time = form.start_time.data
        session_obj.end_time = form.end_time.data
        session_obj.teacher_id = form.teacher_id.data
        session_obj.session_type = form.session_type.data
        session_obj.location = form.location.data.strip() if form.location.data else None
        session_obj.status = form.status.data
        session_obj.description = form.description.data.strip() if form.description.data else None
        
        db.session.commit()
        flash('Session updated successfully.', 'success')
        return redirect(url_for('sessions.view', session_id=session_obj.id))
        
    return render_template('sessions/form.html', form=form, session=session_obj, title=f'Edit Session: {session_obj.title}')


@sessions_bp.route('/<int:session_id>/attendance', methods=['GET', 'POST'])
@login_required
def mark_attendance(session_id):
    """Interactive attendance sheet to mark present, absent, or late per student."""
    session_obj = Session.query.get_or_404(session_id)
    
    # Permission check
    if not (current_user.is_admin or session_obj.teacher_id == current_user.id):
        flash('You do not have permission to mark attendance for this session.', 'danger')
        return redirect(url_for('sessions.view', session_id=session_obj.id))
        
    # Get all active students
    students = Student.query.filter_by(status='Active').order_by(Student.full_name.asc()).all()
    
    # Get existing attendance mapping: {student_id: Attendance}
    existing_records = {a.student_id: a for a in Attendance.query.filter_by(session_id=session_obj.id).all()}
    
    if request.method == 'POST':
        mark_completed = request.form.get('mark_completed') == '1'
        
        for student in students:
            status_key = f"status_{student.id}"
            remarks_key = f"remarks_{student.id}"
            
            status_val = request.form.get(status_key)
            remarks_val = request.form.get(remarks_key, '').strip()
            
            if status_val in ['Present', 'Absent', 'Late']:
                if student.id in existing_records:
                    # Update existing record
                    record = existing_records[student.id]
                    record.status = status_val
                    record.remarks = remarks_val if remarks_val else None
                    record.marked_by_id = current_user.id
                else:
                    # Create new attendance record
                    record = Attendance(
                        session_id=session_obj.id,
                        student_id=student.id,
                        status=status_val,
                        remarks=remarks_val if remarks_val else None,
                        marked_by_id=current_user.id
                    )
                    db.session.add(record)
                    
        if mark_completed:
            session_obj.status = 'Completed'
            
        db.session.commit()
        flash('Attendance records saved successfully.', 'success')
        return redirect(url_for('sessions.view', session_id=session_obj.id))
        
    return render_template(
        'sessions/attendance.html',
        session=session_obj,
        students=students,
        existing_records=existing_records
    )


@sessions_bp.route('/<int:session_id>/delete', methods=['POST'])
@login_required
def delete(session_id):
    """Delete session and cascaded attendance records."""
    session_obj = Session.query.get_or_404(session_id)
    
    if not (current_user.is_admin or session_obj.teacher_id == current_user.id):
        flash('You do not have permission to delete this session.', 'danger')
        return redirect(url_for('sessions.index'))
        
    title = session_obj.title
    db.session.delete(session_obj)
    db.session.commit()
    flash(f'Session "{title}" has been deleted.', 'info')
    return redirect(url_for('sessions.index'))

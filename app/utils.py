import os
import uuid
from datetime import datetime, date
from functools import wraps
from flask import flash, redirect, url_for, current_app
from flask_login import current_user
from werkzeug.utils import secure_filename
from app.extensions import db


def admin_required(f):
    """Decorator to restrict access to administrator users."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        if not current_user.is_admin:
            flash('Access denied. Administrator privileges are required.', 'danger')
            return redirect(url_for('main.dashboard'))
        return f(*args, **kwargs)
    return decorated_function


def generate_student_id():
    """
    Generate next sequential student ID in the format NGO-YYYY-XXXX.
    Example: NGO-2026-0001, NGO-2026-0002.
    """
    from app.models import Student
    current_year = datetime.now().year
    prefix = f"NGO-{current_year}-"
    
    # Query students created with current year prefix
    latest_student = Student.query.filter(Student.student_id.like(f"{prefix}%"))\
        .order_by(Student.student_id.desc())\
        .first()
    
    if latest_student:
        try:
            # Extract the last 4 digits and increment
            last_num_str = latest_student.student_id.split('-')[-1]
            next_num = int(last_num_str) + 1
        except (ValueError, IndexError):
            next_num = Student.query.count() + 1
    else:
        next_num = 1
        
    return f"{prefix}{next_num:04d}"


def save_profile_photo(file_storage):
    """
    Save uploaded profile photo to the static uploads folder with a unique filename.
    Returns the relative filename string or None.
    """
    if not file_storage or not file_storage.filename:
        return None
        
    filename = secure_filename(file_storage.filename)
    if not filename:
        return None
        
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    if ext not in current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'webp'}):
        return None
        
    unique_filename = f"student_{uuid.uuid4().hex[:12]}_{int(datetime.utcnow().timestamp())}.{ext}"
    upload_dir = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    file_storage.save(file_path)
    return unique_filename


def calculate_age(dob):
    """Calculate age in years from date of birth."""
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

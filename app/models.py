from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app.extensions import db, login_manager


class User(UserMixin, db.Model):
    """User account model for Admin and Teacher/Staff."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='teacher')  # 'admin' or 'teacher'
    phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sessions = db.relationship('Session', backref='teacher', lazy='dynamic')
    feedbacks = db.relationship('Feedback', backref='teacher', lazy='dynamic')
    marked_attendances = db.relationship('Attendance', backref='marked_by', lazy='dynamic')

    def set_password(self, password):
        """Hash and set user password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify user password against hash."""
        return check_password_hash(self.password_hash, password)

    @property
    def is_admin(self):
        """Check if user has admin privileges."""
        return self.role == 'admin'

    @property
    def is_teacher(self):
        """Check if user has teacher/staff privileges."""
        return self.role == 'teacher'

    def __repr__(self):
        return f'<User {self.username} ({self.role})>'


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


class Student(db.Model):
    """Student beneficiary model."""
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(30), unique=True, nullable=False, index=True)  # e.g., NGO-2026-0001
    full_name = db.Column(db.String(100), nullable=False, index=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=False, default='Prefer not to say')  # Male, Female, Other, etc.
    parent_name = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    address = db.Column(db.Text, nullable=True)
    joining_date = db.Column(db.Date, default=date.today, nullable=False)
    grade_class = db.Column(db.String(50), nullable=True)  # e.g. "Class 8", "Primary 5"
    school_name = db.Column(db.String(150), nullable=True)
    status = db.Column(db.String(30), default='Active', nullable=False)  # Active, Inactive, Graduated, On Leave
    profile_photo = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    feedbacks = db.relationship(
        'Feedback',
        backref='student',
        lazy='dynamic',
        cascade='all, delete-orphan',
        order_by='Feedback.feedback_date.desc()'
    )
    attendances = db.relationship(
        'Attendance',
        backref='student',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )

    @property
    def attendance_stats(self):
        """Calculate student attendance percentage and counts."""
        records = self.attendances.all()
        total = len(records)
        if total == 0:
            return {
                'total': 0,
                'present': 0,
                'absent': 0,
                'late': 0,
                'percentage': 0.0,
                'effective_present': 0.0
            }
        
        present = sum(1 for r in records if r.status == 'Present')
        late = sum(1 for r in records if r.status == 'Late')
        absent = sum(1 for r in records if r.status == 'Absent')
        
        # Present count + (0.5 * Late count) for effective percentage calculation
        effective = present + (0.5 * late)
        percentage = round((effective / total) * 100, 1)
        
        return {
            'total': total,
            'present': present,
            'absent': absent,
            'late': late,
            'percentage': percentage,
            'effective_present': effective
        }

    @property
    def average_rating(self):
        """Calculate average rating score from feedback."""
        feedbacks = self.feedbacks.all()
        if not feedbacks:
            return None
        ratings = [f.rating for f in feedbacks if f.rating is not None]
        if not ratings:
            return None
        return round(sum(ratings) / len(ratings), 1)

    def __repr__(self):
        return f'<Student {self.student_id} - {self.full_name}>'


class Session(db.Model):
    """Session model for learning, mentorship, and workshops."""
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    date = db.Column(db.Date, nullable=False, index=True)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    description = db.Column(db.Text, nullable=True)
    session_type = db.Column(db.String(50), default='Academic', nullable=False)  # Academic, Skill Workshop, Mentorship, Extracurricular, Other
    status = db.Column(db.String(30), default='Scheduled', nullable=False)  # Scheduled, Completed, Cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    attendances = db.relationship('Attendance', backref='session', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def attendance_summary(self):
        """Summary counts of attendance for this session."""
        records = self.attendances.all()
        total = len(records)
        present = sum(1 for r in records if r.status == 'Present')
        absent = sum(1 for r in records if r.status == 'Absent')
        late = sum(1 for r in records if r.status == 'Late')
        rate = round(((present + (0.5 * late)) / total * 100), 1) if total > 0 else 0.0
        return {
            'total': total,
            'present': present,
            'absent': absent,
            'late': late,
            'rate': rate
        }

    def __repr__(self):
        return f'<Session {self.id}: {self.title} on {self.date}>'


class Attendance(db.Model):
    """Attendance record per student per session."""
    __tablename__ = 'attendances'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False)  # 'Present', 'Absent', 'Late'
    remarks = db.Column(db.String(255), nullable=True)
    marked_by_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Ensure unique attendance entry per student per session
    __table_args__ = (
        db.UniqueConstraint('session_id', 'student_id', name='uq_session_student_attendance'),
    )

    def __repr__(self):
        return f'<Attendance Student {self.student_id} in Session {self.session_id}: {self.status}>'


class Feedback(db.Model):
    """Weekly / Periodic progress feedback given by teacher to student."""
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    feedback_date = db.Column(db.Date, default=date.today, nullable=False, index=True)
    subject_area = db.Column(db.String(100), nullable=True)  # e.g., Mathematics, English, General Conduct, Life Skills
    attendance_obs = db.Column(db.String(100), nullable=True)  # e.g., Regular, Occasional Absence, Needs Motivation
    academic_progress = db.Column(db.Text, nullable=True)
    behaviour = db.Column(db.Text, nullable=True)
    participation = db.Column(db.Text, nullable=True)
    strengths = db.Column(db.Text, nullable=True)
    improvement_areas = db.Column(db.Text, nullable=True)
    comments = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=False, default=3)  # 1 (Needs Improvement) to 5 (Excellent)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def rating_label(self):
        labels = {
            1: 'Needs Improvement',
            2: 'Below Average',
            3: 'Satisfactory',
            4: 'Good',
            5: 'Excellent'
        }
        return labels.get(self.rating, 'Satisfactory')

    @property
    def rating_badge_class(self):
        classes = {
            1: 'bg-danger',
            2: 'bg-warning text-dark',
            3: 'bg-info text-dark',
            4: 'bg-primary',
            5: 'bg-success'
        }
        return classes.get(self.rating, 'bg-secondary')

    def __repr__(self):
        return f'<Feedback Student {self.student_id} Date {self.feedback_date} Rating {self.rating}>'

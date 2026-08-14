from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, Optional, ValidationError
from app.models import User


class UserForm(FlaskForm):
    """Form to create or edit staff/admin user."""
    full_name = StringField('Full Name', validators=[
        DataRequired(message='Full Name is required.'),
        Length(max=100)
    ], render_kw={"placeholder": "e.g. Jane Doe"})
    
    username = StringField('Username', validators=[
        DataRequired(message='Username is required.'),
        Length(min=3, max=64)
    ], render_kw={"placeholder": "e.g. jane.doe"})
    
    email = StringField('Email Address', validators=[
        DataRequired(message='Valid email is required.'),
        Email(message='Please provide a valid email.'),
        Length(max=120)
    ], render_kw={"placeholder": "e.g. jane@ngo.org"})
    
    phone = StringField('Phone Number', validators=[
        Optional(),
        Length(max=20)
    ], render_kw={"placeholder": "e.g. +1 555 123 4567"})
    
    role = SelectField('User Role', choices=[
        ('teacher', 'Teacher / Staff'),
        ('admin', 'Administrator')
    ], default='teacher', validators=[DataRequired()])
    
    password = PasswordField('Password', validators=[
        Optional(),
        Length(min=6, message='Password must be at least 6 characters long.')
    ], render_kw={"placeholder": "Leave empty if not changing"})
    
    is_active = BooleanField('Active Account', default=True)
    submit = SubmitField('Save User')

    def __init__(self, original_user_id=None, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.original_user_id = original_user_id

    def validate_username(self, field):
        user = User.query.filter_by(username=field.data.strip()).first()
        if user and user.id != self.original_user_id:
            raise ValidationError('This username is already taken. Please choose another.')

    def validate_email(self, field):
        user = User.query.filter_by(email=field.data.strip().lower()).first()
        if user and user.id != self.original_user_id:
            raise ValidationError('This email is already registered. Please use another.')

from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DateField, SelectField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Optional, Email, Length
from datetime import date


class StudentForm(FlaskForm):
    """Student registration and update form."""
    student_id = StringField('Student ID', render_kw={"readonly": True, "placeholder": "Auto-generated upon save"})
    
    full_name = StringField('Full Name', validators=[
        DataRequired(message='Full name is required.'),
        Length(max=100)
    ], render_kw={"placeholder": "e.g. Rahul Sharma"})
    
    dob = DateField('Date of Birth', validators=[Optional()], render_kw={"placeholder": "YYYY-MM-DD"})
    
    gender = SelectField('Gender', choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
        ('Prefer not to say', 'Prefer not to say')
    ], default='Prefer not to say', validators=[DataRequired()])
    
    parent_name = StringField('Parent / Guardian Name', validators=[
        Optional(),
        Length(max=100)
    ], render_kw={"placeholder": "e.g. Sunita Sharma"})
    
    phone = StringField('Contact Phone Number', validators=[
        Optional(),
        Length(max=20)
    ], render_kw={"placeholder": "e.g. +91 98765 43210"})
    
    email = StringField('Email Address (if applicable)', validators=[
        Optional(),
        Email(message='Invalid email format.'),
        Length(max=120)
    ], render_kw={"placeholder": "e.g. student@example.com"})
    
    address = TextAreaField('Residential Address', validators=[Optional()], render_kw={"rows": 2, "placeholder": "Full residential address"})
    
    joining_date = DateField('Joining Date', default=date.today, validators=[DataRequired()])
    
    grade_class = StringField('Class / Grade / Level', validators=[
        Optional(),
        Length(max=50)
    ], render_kw={"placeholder": "e.g. Class 7, Grade 10, Voc. Training"})
    
    school_name = StringField('School / Institute Name', validators=[
        Optional(),
        Length(max=150)
    ], render_kw={"placeholder": "e.g. Government High School"})
    
    status = SelectField('Enrollment Status', choices=[
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Graduated', 'Graduated'),
        ('On Leave', 'On Leave')
    ], default='Active', validators=[DataRequired()])
    
    profile_photo = FileField('Profile Photo', validators=[
        Optional(),
        FileAllowed(['jpg', 'jpeg', 'png', 'webp', 'gif'], 'Only image files (JPG, PNG, WEBP, GIF) are allowed.')
    ])
    
    notes = TextAreaField('Additional Background / Medical Notes', validators=[Optional()], render_kw={"rows": 3, "placeholder": "Any special needs, family background, or notes"})
    
    submit = SubmitField('Save Student Record')

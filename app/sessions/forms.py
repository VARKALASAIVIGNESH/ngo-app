from flask_wtf import FlaskForm
from wtforms import StringField, DateField, TimeField, SelectField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Optional, Length
from datetime import date, time


class SessionForm(FlaskForm):
    """Form to create or update educational/mentorship session."""
    title = StringField('Session Title', validators=[
        DataRequired(message='Session title is required.'),
        Length(max=150)
    ], render_kw={"placeholder": "e.g. Basic Mathematics & Geometry Workshop"})
    
    date = DateField('Session Date', default=date.today, validators=[
        DataRequired(message='Date is required.')
    ])
    
    start_time = TimeField('Start Time', default=time(10, 0), validators=[
        DataRequired(message='Start time is required.')
    ])
    
    end_time = TimeField('End Time', default=time(11, 30), validators=[
        DataRequired(message='End time is required.')
    ])
    
    teacher_id = SelectField('Assigned Teacher / Instructor', coerce=int, validators=[
        DataRequired(message='Please assign an instructor.')
    ])
    
    session_type = SelectField('Session Category', choices=[
        ('Academic', 'Academic (Math, Science, Language)'),
        ('Skill Workshop', 'Skill Workshop & Vocational'),
        ('Mentorship', 'Mentorship & Guidance'),
        ('Extracurricular', 'Extracurricular & Arts / Sports'),
        ('Life Skills', 'Life Skills & Hygiene / Health'),
        ('Other', 'Other')
    ], default='Academic', validators=[DataRequired()])
    
    location = StringField('Location / Room / Venue', validators=[
        Optional(),
        Length(max=150)
    ], render_kw={"placeholder": "e.g. Center Room 2 / Online Zoom"})
    
    status = SelectField('Session Status', choices=[
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled')
    ], default='Scheduled', validators=[DataRequired()])
    
    description = TextAreaField('Session Agenda / Description', validators=[
        Optional()
    ], render_kw={"rows": 3, "placeholder": "Topics to cover, materials required, key objectives"})
    
    submit = SubmitField('Save Session')

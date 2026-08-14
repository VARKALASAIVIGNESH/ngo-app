from flask_wtf import FlaskForm
from wtforms import SelectField, DateField, StringField, TextAreaField, RadioField, SubmitField
from wtforms.validators import DataRequired, Optional, Length
from datetime import date


class FeedbackForm(FlaskForm):
    """Weekly/Periodic student feedback submission form."""
    student_id = SelectField('Select Student', coerce=int, validators=[
        DataRequired(message='Please select a student.')
    ])
    
    feedback_date = DateField('Week Ending / Feedback Date', default=date.today, validators=[
        DataRequired(message='Feedback date is required.')
    ])
    
    subject_area = StringField('Subject / Focus Area', validators=[
        Optional(),
        Length(max=100)
    ], render_kw={"placeholder": "e.g. Mathematics, English Literacy, Science, General Conduct"})
    
    attendance_obs = SelectField('Attendance & Punctuality Observation', choices=[
        ('Regular & Punctual', 'Regular & Punctual'),
        ('Mostly Regular', 'Mostly Regular'),
        ('Frequent Absences', 'Frequent Absences'),
        ('Frequently Late', 'Frequently Late'),
        ('Irregular / Needs Follow-up', 'Irregular / Needs Follow-up')
    ], default='Regular & Punctual', validators=[DataRequired()])
    
    rating = RadioField('Overall Rating / Progress Score', choices=[
        ('5', '5 - Excellent (Outstanding performance & attitude)'),
        ('4', '4 - Good (Consistently meeting goals)'),
        ('3', '3 - Satisfactory (Average progress, on track)'),
        ('2', '2 - Below Average (Struggling, needs extra attention)'),
        ('1', '1 - Needs Improvement (Critical focus required)')
    ], default='3', validators=[DataRequired()])
    
    academic_progress = TextAreaField('Academic Progress & Learning Comprehension', validators=[
        Optional()
    ], render_kw={"rows": 2, "placeholder": "Understanding of topics covered, homework completion, test performance"})
    
    behaviour = TextAreaField('Behaviour & Social Conduct', validators=[
        Optional()
    ], render_kw={"rows": 2, "placeholder": "Classroom discipline, teamwork, respect for peers and instructors"})
    
    participation = TextAreaField('Participation & Engagement', validators=[
        Optional()
    ], render_kw={"rows": 2, "placeholder": "Eagerness to ask questions, active in discussions, attentiveness"})
    
    strengths = TextAreaField('Key Strengths Observed', validators=[
        Optional()
    ], render_kw={"rows": 2, "placeholder": "Notable skills, positive traits, quick learning areas"})
    
    improvement_areas = TextAreaField('Areas for Improvement & Action Items', validators=[
        Optional()
    ], render_kw={"rows": 2, "placeholder": "What should the student work on next week?"})
    
    comments = TextAreaField('Additional Teacher Comments & Remarks', validators=[
        Optional()
    ], render_kw={"rows": 3, "placeholder": "Any notes for parents, mentors, or other staff"})
    
    submit = SubmitField('Submit Feedback')

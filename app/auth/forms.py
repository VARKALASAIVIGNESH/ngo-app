from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo


class LoginForm(FlaskForm):
    """User login form."""
    username_or_email = StringField('Username or Email', validators=[
        DataRequired(message='Please enter your username or email address.'),
        Length(min=3, max=120)
    ], render_kw={"placeholder": "e.g. admin or admin@ngo.org", "autofocus": True})
    
    password = PasswordField('Password', validators=[
        DataRequired(message='Please enter your password.')
    ], render_kw={"placeholder": "Enter your password"})
    
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class ChangePasswordForm(FlaskForm):
    """Form to change password."""
    current_password = PasswordField('Current Password', validators=[
        DataRequired(message='Current password is required.')
    ])
    new_password = PasswordField('New Password', validators=[
        DataRequired(message='New password is required.'),
        Length(min=6, message='Password must be at least 6 characters long.')
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(message='Please confirm your new password.'),
        EqualTo('new_password', message='Passwords must match.')
    ])
    submit = SubmitField('Update Password')

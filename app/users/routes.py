from flask import render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app.users import users_bp
from app.users.forms import UserForm
from app.models import User
from app.extensions import db
from app.utils import admin_required


@users_bp.route('/')
@login_required
@admin_required
def index():
    """List all staff and admin accounts."""
    role_filter = request.args.get('role', '')
    query = User.query
    
    if role_filter in ['admin', 'teacher']:
        query = query.filter_by(role=role_filter)
        
    users = query.order_by(User.created_at.desc()).all()
    return render_template('users/list.html', users=users, current_role_filter=role_filter)


@users_bp.route('/new', methods=['GET', 'POST'])
@login_required
@admin_required
def create():
    """Create a new staff or admin user."""
    form = UserForm()
    if form.validate_on_submit():
        if not form.password.data:
            flash('Password is required when creating a new user.', 'danger')
            return render_template('users/form.html', form=form, title='Add New User')
            
        user = User(
            full_name=form.full_name.data.strip(),
            username=form.username.data.strip(),
            email=form.email.data.strip().lower(),
            phone=form.phone.data.strip() if form.phone.data else None,
            role=form.role.data,
            is_active=form.is_active.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        
        flash(f'User "{user.full_name}" ({user.username}) created successfully.', 'success')
        return redirect(url_for('users.index'))
        
    return render_template('users/form.html', form=form, title='Add New User')


@users_bp.route('/<int:user_id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(user_id):
    """Edit user details and permissions."""
    user = User.query.get_or_404(user_id)
    form = UserForm(original_user_id=user.id, obj=user)
    
    if form.validate_on_submit():
        user.full_name = form.full_name.data.strip()
        user.username = form.username.data.strip()
        user.email = form.email.data.strip().lower()
        user.phone = form.phone.data.strip() if form.phone.data else None
        
        # Don't allow demoting the last active admin if this is the only one
        if user.id == current_user.id and form.role.data != 'admin':
            admin_count = User.query.filter_by(role='admin', is_active=True).count()
            if admin_count <= 1:
                flash('Cannot remove admin role from your account as you are the only active admin.', 'danger')
                return render_template('users/form.html', form=form, user=user, title=f'Edit User: {user.full_name}')
                
        user.role = form.role.data
        
        # Prevent self-deactivation
        if user.id == current_user.id and not form.is_active.data:
            flash('You cannot deactivate your own logged-in account.', 'danger')
            return render_template('users/form.html', form=form, user=user, title=f'Edit User: {user.full_name}')
            
        user.is_active = form.is_active.data
        
        # If new password provided, update it
        if form.password.data:
            user.set_password(form.password.data)
            
        db.session.commit()
        flash(f'User "{user.full_name}" updated successfully.', 'success')
        return redirect(url_for('users.index'))
        
    return render_template('users/form.html', form=form, user=user, title=f'Edit User: {user.full_name}')


@users_bp.route('/<int:user_id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(user_id):
    """Delete a user account."""
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        flash('You cannot delete your own active account.', 'danger')
        return redirect(url_for('users.index'))
        
    if user.is_admin:
        admin_count = User.query.filter_by(role='admin').count()
        if admin_count <= 1:
            flash('Cannot delete the last remaining administrator account.', 'danger')
            return redirect(url_for('users.index'))
            
    db.session.delete(user)
    db.session.commit()
    flash(f'User "{user.full_name}" has been deleted.', 'info')
    return redirect(url_for('users.index'))

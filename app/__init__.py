import os
from flask import Flask, render_template
from config import config
from app.extensions import db, login_manager, csrf


def create_app(config_name='default'):
    """Application factory pattern."""
    app = Flask(__name__)
    
    # Load configuration
    app_config = config.get(config_name, config['default'])
    app.config.from_object(app_config)
    
    # Ensure upload and instance directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['INSTANCE_DIR'], exist_ok=True)
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    
    # Register Jinja custom template filters & context processors
    @app.template_filter('date_format')
    def date_format(value, format='%b %d, %Y'):
        if value is None:
            return ""
        return value.strftime(format)

    @app.template_filter('time_format')
    def time_format(value, format='%I:%M %p'):
        if value is None:
            return ""
        return value.strftime(format)

    @app.context_processor
    def inject_global_variables():
        from datetime import datetime
        return {
            'current_year': datetime.now().year,
            'app_name': 'NGO Management System'
        }
    
    # Register Blueprints
    from app.auth import auth_bp
    from app.main import main_bp
    from app.students import students_bp
    from app.feedback import feedback_bp
    from app.sessions import sessions_bp
    from app.reports import reports_bp
    from app.users import users_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(sessions_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(users_bp)
    
    # Global Error Handlers
    @app.errorhandler(403)
    def forbidden_error(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template('errors/500.html'), 500
        
    return app

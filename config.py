import os
from dotenv import load_dotenv

# Base directory of the project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env if present
load_dotenv(os.path.join(BASE_DIR, '.env'))


class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ngo-app-secret-key-default-2026-development')
    
    # Check if running on Vercel serverless environment
    IS_VERCEL = os.environ.get('VERCEL') == '1' or 'VERCEL' in os.environ
    
    if IS_VERCEL:
        INSTANCE_DIR = '/tmp'
        UPLOAD_FOLDER = '/tmp/uploads'
    else:
        INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
        UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')

    os.makedirs(INSTANCE_DIR, exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'ngo.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 5 * 1024 * 1024))  # 5 MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Items per page for pagination
    ITEMS_PER_PAGE = 10


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Ensure SECRET_KEY is set in production
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ngo-production-fallback-key-should-be-overridden')


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

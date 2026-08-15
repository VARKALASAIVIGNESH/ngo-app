import os
from dotenv import load_dotenv

# Base directory of the project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env if present
load_dotenv(os.path.join(BASE_DIR, '.env'))


class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ngo-app-secret-key-default-2026-development')
    
    # Safe writable directory detection (Vercel / AWS Lambda / Local)
    is_serverless = bool(
        os.environ.get('VERCEL') or 
        os.environ.get('AWS_LAMBDA_FUNCTION_NAME') or 
        os.environ.get('VERCEL_ENV')
    )
    
    if is_serverless or not os.access(BASE_DIR, os.W_OK):
        INSTANCE_DIR = '/tmp'
        UPLOAD_FOLDER = '/tmp/uploads'
    else:
        INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
        UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')

    try:
        os.makedirs(INSTANCE_DIR, exist_ok=True)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    except Exception:
        INSTANCE_DIR = '/tmp'
        UPLOAD_FOLDER = '/tmp'

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'ngo.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 5 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    ITEMS_PER_PAGE = 10


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ngo-production-secret-key-srinivas-2026')


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': ProductionConfig if (os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV')) else DevelopmentConfig
}

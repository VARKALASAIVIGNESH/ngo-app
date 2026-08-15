import os
from dotenv import load_dotenv

# Base directory of the project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env if present
load_dotenv(os.path.join(BASE_DIR, '.env'))


def get_safe_storage_dir(subpath):
    """
    Returns a writable directory path.
    Tries project local path first. If read-only (e.g. Vercel serverless), falls back to /tmp.
    """
    # If explicitly running on Vercel
    if os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
        tmp_dir = os.path.join('/tmp', subpath)
        try:
            os.makedirs(tmp_dir, exist_ok=True)
            return tmp_dir
        except Exception:
            return '/tmp'

    local_dir = os.path.join(BASE_DIR, subpath)
    try:
        os.makedirs(local_dir, exist_ok=True)
        # Test write capability
        test_file = os.path.join(local_dir, '.write_check')
        with open(test_file, 'w') as f:
            f.write('ok')
        os.remove(test_file)
        return local_dir
    except (OSError, PermissionError):
        tmp_dir = os.path.join('/tmp', subpath)
        os.makedirs(tmp_dir, exist_ok=True)
        return tmp_dir


class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ngo-app-secret-key-default-2026-development')
    
    INSTANCE_DIR = get_safe_storage_dir('instance')
    UPLOAD_FOLDER = get_safe_storage_dir(os.path.join('app', 'static', 'uploads'))
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'ngo.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 5 * 1024 * 1024))  # 5 MB
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
    'default': ProductionConfig if os.environ.get('VERCEL') else DevelopmentConfig
}

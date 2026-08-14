import os
import sys

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.extensions import db
from app.models import User
from seed import seed_database

# Create production app instance
app = create_app(os.environ.get('FLASK_ENV', 'production'))

# Auto initialize and seed SQLite on cold start if database is new
with app.app_context():
    db.create_all()
    try:
        if User.query.count() == 0:
            seed_database()
    except Exception as e:
        pass

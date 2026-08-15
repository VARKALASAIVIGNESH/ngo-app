import os
import sys

# Ensure root directory is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app
from app.extensions import db
from app.models import User
from seed import populate_seed_data

# Create application
app = create_app('production')

# Auto-initialize SQLite database in /tmp if not created yet
with app.app_context():
    try:
        db.create_all()
        # Seed default users if database is empty
        if User.query.filter_by(username='srinivas').first() is None:
            populate_seed_data(db)
    except Exception as e:
        print(f"Error during Vercel startup init: {e}")

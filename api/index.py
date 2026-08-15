import os
import sys
import traceback

# Add project root to Python search path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from app import create_app
    from app.extensions import db
    from app.models import User
    from seed import populate_seed_data

    # Create app instance
    flask_app = create_app('production')
    _db_ready = False

    def ensure_database():
        global _db_ready
        if not _db_ready:
            try:
                db.create_all()
                if User.query.filter_by(username='srinivas').first() is None:
                    populate_seed_data(db)
                _db_ready = True
            except Exception as ex:
                print(f"Error during on-demand DB init: {ex}")

    @flask_app.before_request
    def initialize_on_first_request():
        ensure_database()

    app = flask_app

except Exception as fatal_err:
    trace = traceback.format_exc()
    print(f"FATAL STARTUP EXCEPTION: {trace}")
    
    from flask import Flask, Response
    app = Flask(__name__)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def error_fallback(path):
        return Response(
            f"<html><body style='font-family:sans-serif;padding:2rem;background:#fef2f2;color:#991b1b;'>"
            f"<h2>Application Startup Error</h2>"
            f"<pre style='background:#ffffff;padding:1rem;border-radius:8px;border:1px solid #fecaca;overflow:auto;'>{trace}</pre>"
            f"</body></html>",
            mimetype="text/html",
            status=500
        )

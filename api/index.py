import os
import sys
import traceback

# Ensure project root is in sys.path
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
    _db_initialized = False

    def init_database():
        global _db_initialized
        if not _db_initialized:
            try:
                db.create_all()
                if User.query.filter_by(username='srinivas').first() is None:
                    populate_seed_data(db)
                _db_initialized = True
            except Exception as ex:
                print(f"Database init warning: {ex}")

    @flask_app.before_request
    def on_request():
        init_database()

    # WSGI Middleware to fix Vercel route prefix rewriting
    class VercelPathFix:
        def __init__(self, wsgi_app):
            self.wsgi_app = wsgi_app

        def __call__(self, environ, start_response):
            path = environ.get('PATH_INFO', '')
            if path.startswith('/api/index'):
                environ['PATH_INFO'] = path[10:] or '/'
            elif path.startswith('/api'):
                environ['PATH_INFO'] = path[4:] or '/'
            return self.wsgi_app(environ, start_response)

    flask_app.wsgi_app = VercelPathFix(flask_app.wsgi_app)
    app = flask_app

except Exception as fatal_error:
    err_trace = traceback.format_exc()
    print(f"FATAL VERCEL STARTUP ERROR:\n{err_trace}")
    
    from flask import Flask, Response
    app = Flask(__name__)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def error_view(path):
        return Response(
            f"<html><body style='font-family:sans-serif;padding:30px;background:#fef2f2;'>"
            f"<h2 style='color:#dc2626;'>Startup Traceback</h2>"
            f"<pre style='background:#ffffff;border:1px solid #fca5a5;padding:15px;border-radius:6px;overflow:auto;'>{err_trace}</pre>"
            f"</body></html>",
            mimetype='text/html',
            status=500
        )

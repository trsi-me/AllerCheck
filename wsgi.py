"""WSGI entry for Gunicorn on Render."""
from app import app

application = app

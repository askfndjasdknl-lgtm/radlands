from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    static_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dist')
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    
    database_url = os.getenv('DATABASE_URL', 'sqlite:///radlands.db')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    db.init_app(app)
    
    from backend.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    with app.app_context():
        db.create_all()
        
        from backend.models import Card
        from backend.seeds import seed_cards
        
        if Card.query.count() == 0:
            seed_cards()
            print("Database seeded with Radlands cards")
    
    return app

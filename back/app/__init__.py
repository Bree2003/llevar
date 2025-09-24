from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Registrar el Blueprint de la API
    from app.api.v1 import files as files_v1_bp
    app.register_blueprint(files_v1_bp.bp, url_prefix='/api/v1')
    
    return app
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.routes.storage_routes import storage_bp
from app.routes.logging_routes import logging_bp
from app.routes.pipeline_routes import pipeline_bp
from app.utils.exceptions import InvalidUsage


def create_app():
    """
    Application Factory: Crea y configura la instancia de la aplicación Flask
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS con los orígenes permitidos
    CORS(app, origins=Config.CORS_ORIGINS)

    # Registrar Blueprints para organizar las rutas
    app.register_blueprint(storage_bp, url_prefix="/api/storage")
    app.register_blueprint(logging_bp, url_prefix="/api/logs")
    app.register_blueprint(pipeline_bp, url_prefix="/api/pipeline")

    # Registrar un manejador de errores personalizado para toda la app
    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    return app

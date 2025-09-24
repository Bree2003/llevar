from flask import Flask
from flask_cors import CORS
from config import Config

# Blueprints (cuando ya tengas tus rutas)
from routes.storage_routes import storage_bp
from routes.logging_routes import logging_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS con los orígenes permitidos
    CORS(app, origins=Config.CORS_ORIGINS)

    # Registrar Blueprints
    app.register_blueprint(storage_bp, url_prefix="/api/storage")
    app.register_blueprint(logging_bp, url_prefix="/api/logs")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

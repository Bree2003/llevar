import os
from asgiref.wsgi import WsgiToAsgi
from app import create_app

# Crea la instancia de la aplicación usando la factory
flask_app = create_app()

# Envuelve la app WSGI como ASGI para servirla con Hypercorn (HTTP2)
asgi_app = WsgiToAsgi(flask_app)

if __name__ == "__main__":
    # Obtiene el puerto del entorno o usa 8080 por defecto
    port = int(os.environ.get("PORT", 8080))
    # Ejecuta la aplicación en modo debug
    flask_app.run(host="0.0.0.0", port=port, debug=True)
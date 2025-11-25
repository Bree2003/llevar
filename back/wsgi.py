import os
from app import create_app

# Crea la instancia de la aplicación usando la factory
app = create_app()

if __name__ == "__main__":
    # Obtiene el puerto del entorno o usa 5000 por defecto
    port = int(os.environ.get("PORT", 5000))
    # Ejecuta la aplicación en modo debug
    app.run(host="0.0.0.0", port=port, debug=True)
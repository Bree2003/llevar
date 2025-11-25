from flask import jsonify

class InvalidUsage(Exception):
    """
    Excepción personalizada para manejar errores de API de forma controlada.
    Permite devolver un mensaje de error y un código de estado HTTP específico
    """
    status_code = 400
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
        
    def to_dict(self):
        """
        Convierte la excepción en un diccionario para la respuesta JSON
        """
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv
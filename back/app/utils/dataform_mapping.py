def resolve_dataform_name(product_name):
    """
    Prepara el nombre del producto para usarlo en nombres de repositorios Dataform.

    Reglas:
    1. Mantiene los guiones medios (-) -> NO los cambia a guiones bajos (_).
    2. Elimina la partícula "-de-" por redundancia.
       Ej: 'avisos-de-mantenimiento' -> 'avisos-mantenimiento'
           'programa-de-fabricacion' -> 'programa-fabricacion'
           'notificaciones'          -> 'notificaciones'
    """
    if not product_name:
        return ""

    # 1. Normalización básica
    clean_name = product_name.strip().lower()

    # 2. Eliminación de la partícula "-de-"
    # Reemplazamos "-de-" por "-" para mantener la separación
    clean_name = clean_name.replace("-de-", "-")

    return clean_name

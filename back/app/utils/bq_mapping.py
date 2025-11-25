def resolve_bq_target(env_id, bucket_name, product_name, table_name):
    """
    Traduce la ruta de GCS a una referencia de tabla de BigQuery.
    Esta lógica depende 100% de tu convención de nombres.
    """

    # EJEMPLO DE LÓGICA (Ajusta esto a tu realidad):
    # Si env_id='sap', el proyecto BQ podría ser 'cyt-dev-ddo-bq'
    # El dataset podría ser el nombre del producto: 'manual' -> 'ds_manual'

    bq_project_id = "cyt-dev-ddo-gcp"  # O dinámico según env_id

    # Mapeo de entornos a proyectos BQ (ejemplo)
    if env_id == 'sap':
        bq_project_id = 'cyt-dev-ddo-gcp'
    elif env_id == 'pd':
        bq_project_id = 'cyt-dev-hq-osc-gcp'

    # Asumimos que el dataset se llama igual que el producto (o con prefijo)
    # BQ no acepta guiones, solo guiones bajos
    dataset_id = product_name.replace("-", "_")

    # Asumimos que la tabla se llama igual que la carpeta
    table_id = table_name.replace("-", "_")

    return bq_project_id, dataset_id, table_id

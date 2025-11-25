def resolve_bq_coordinates(project_id, product_name, table_name):
    """
    Transforma los nombres de carpetas de GCS a referencias válidas de BigQuery.
    BigQuery usa guiones bajos (_), GCS suele usar guiones medios (-).
    """

    # 1. El proyecto es el mismo que obtuvimos dinámicamente
    bq_project_id = project_id

    # 2. El Dataset suele ser el nombre del producto (limpiando caracteres)
    dataset_id = product_name.replace("-", "_")

    # 3. La Tabla es el nombre de la subcarpeta
    table_id = table_name.replace("-", "_")

    return bq_project_id, dataset_id, table_id

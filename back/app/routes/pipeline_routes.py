from flask import Blueprint, request, jsonify
from app.utils.dataform_mapping import resolve_dataform_name
from app.services import dataform_service, logging_service
from app.utils.exceptions import InvalidUsage

pipeline_bp = Blueprint("pipeline", __name__)

DATAFORM_REGION = "us-east4"


@pipeline_bp.route("/run-product", methods=["POST"])
def run_product_pipeline_api():
    """
    Ejecuta el workspace 'development' de Dataform.
    Requiere project_id y product_name en el body.
    """
    data = request.get_json()

    if not data:
        raise InvalidUsage("No payload received.", status_code=400)

    # 1. Obtenemos datos OBLIGATORIOS del request
    product_name = data.get('product_name')
    project_id = data.get('project_id')
    user = data.get('user', 'anonymous')

    # 2. Validación estricta
    if not product_name:
        raise InvalidUsage("Falta el campo 'product_name'.", status_code=400)

    if not project_id:
        raise InvalidUsage("Falta el campo 'project_id'.", status_code=400)

    try:
        # 3. Limpieza de nombre (quita 'de', mantiene guiones)
        clean_name = resolve_dataform_name(product_name)

        # 4. Construcción dinámica del repo
        repo_name = f"df-{clean_name}"

        # 5. Ejecutar Dataform
        # Usamos el project_id que vino del front y la region hardcodeada
        result = dataform_service.run_dataform_workspace_all(
            project_id=project_id,
            location=DATAFORM_REGION,
            repository_name=repo_name,
            workspace="development"
        )

        # 6. Logging y Respuesta
        logging_service.log_info(
            "Dataform Triggered",
            user=user,
            product=product_name,
            project=project_id,
            repo=repo_name,
            invocation_id=result['invocation_id']
        )

        return jsonify({
            "success": True,
            "message": f"Ejecución iniciada para '{clean_name}' en el proyecto '{project_id}' (Repo: {repo_name}).",
            "details": result
        })

    except Exception as e:
        logging_service.log_error("Pipeline Error", user=user, error=str(e))
        return jsonify({
            "success": False,
            "error": f"Error ejecutando Dataform: {str(e)}"
        }), 500

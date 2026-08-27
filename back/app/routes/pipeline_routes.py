import os
from flask import Blueprint, request, jsonify
from app.utils.dataform_mapping import resolve_dataform_name
from app.services import dataform_service, logging_service
from app.utils.exceptions import InvalidUsage

pipeline_bp = Blueprint("pipeline", __name__)

DATAFORM_REGION = "us-east4"

@pipeline_bp.route("/run-product", methods=["POST"])
def run_product_pipeline_api():
    """
    Ejecuta el workspace de Dataform según el entorno.
    """
    data = request.get_json()

    if not data:
        raise InvalidUsage("No payload received.", status_code=400)

    product_name = data.get('product_name')
    user = data.get('user', 'anonymous')

    if not product_name:
        raise InvalidUsage("Falta el campo 'product_name'.", status_code=400)

    try:
        env_var = os.getenv('ENV', 'dev').lower()

        if env_var == "prd":
            target_project_id = "cyt-prd-hq-osc-gcp"
            target_workspace = "production"
        else:
            target_project_id = "cyt-dev-hq-osc-gcp"
            target_workspace = "development"
            
        clean_name = resolve_dataform_name(product_name)
        repo_name = f"df-{clean_name}"
        result = dataform_service.run_dataform_workspace_all(
            project_id=target_project_id, 
            location=DATAFORM_REGION,
            repository_name=repo_name,
            workspace=target_workspace 
        )

        logging_service.log_info(
            "Dataform Triggered",
            user=user,
            dataform=product_name,
            project=target_project_id,
            repo=repo_name,
            invocation_id=result['invocation_id']
        )

        return jsonify({
            "success": True,
            "message": f"Ejecución iniciada para '{clean_name}' en el proyecto '{target_project_id}' (Repo: {repo_name}).",
            "details": result
        })

    except Exception as e:
        logging_service.log_error("Pipeline Error", user=user, error=str(e))
        return jsonify({
            "success": False,
            "error": f"Error ejecutando Dataform: {str(e)}"
        }), 500
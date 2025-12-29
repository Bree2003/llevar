from google.cloud import dataform_v1beta1


def run_dataform_workspace_all(project_id, location, repository_name, workspace="development"):
    """
    Replica el botón "Ejecutar -> Todo" de la consola de GCP dentro de un Workspace.

    Args:
        repository_name (str): Nombre del repo (ej: 'df-notificaciones').
        workspace (str): Nombre del workspace (ej: 'development').
    """
    client = dataform_v1beta1.DataformClient()

    # Rutas base
    repo_path = f"projects/{project_id}/locations/{location}/repositories/{repository_name}"
    workspace_path = f"{repo_path}/workspaces/{workspace}"

    try:
        # 1. COMPILACIÓN DESDE EL WORKSPACE
        # Esto le dice: "Usa el código que está actualmente en la carpeta 'development'"
        compilation_result_req = dataform_v1beta1.CompilationResult()
        compilation_result_req.workspace = workspace_path

        compilation_result = client.create_compilation_result(
            parent=repo_path,
            compilation_result=compilation_result_req
        )
        print(f"Compilación exitosa: {compilation_result.name}")

        # 2. INVOCACIÓN (EJECUCIÓN)
        invocation_req = dataform_v1beta1.WorkflowInvocation()
        invocation_req.compilation_result = compilation_result.name

        # Opcional: Si quieres forzar "Run full refresh" (recrear tablas desde cero),
        # descomenta la siguiente línea. Si no, hará incremental si aplica.
        # invocation_req.invocation_config = dataform_v1beta1.WorkflowInvocation.InvocationConfig(
        #    fully_refresh_incremental_tables_enabled=False
        # )

        invocation = client.create_workflow_invocation(
            parent=repo_path,
            workflow_invocation=invocation_req
        )

        return {
            "invocation_id": invocation.name.split('/')[-1],
            "state": invocation.state.name,  # Ej: RUNNING
            "repo": repository_name,
            "workspace": workspace,
            "url": f"https://console.cloud.google.com/bigquery/dataform/locations/{location}/repositories/{repository_name}/workflows/{invocation.name.split('/')[-1]}?project={project_id}"
        }

    except Exception as e:
        print(f"Error ejecutando Dataform Workspace: {e}")
        raise e

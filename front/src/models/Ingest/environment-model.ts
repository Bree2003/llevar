import { EnvironmentResponse } from "services/Ingest/ingest-service";

export interface EnvironmentModel {
  id: string;
  label: string;      // Viene de 'name'
  buckets: string[];
  projectId: string;  // Viene de 'project_id'
}

const EnvironmentAdapter = (data: EnvironmentResponse[]): EnvironmentModel[] => {
  // Protección contra respuestas vacías o nulas
  if (!data || !Array.isArray(data)) return [];

  const output: EnvironmentModel[] = [];

  for (const item of data) {
    output.push({
      id: item.id,
      label: item.name,
      buckets: item.buckets || [],
      projectId: item.project_id
    });
  }

  return output;
};

export default EnvironmentAdapter;
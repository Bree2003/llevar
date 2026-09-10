import { AxiosGet } from "services/utils";

export interface LinksDataResponse {
  enlace_acceso_reporte: string;
  enlace_soporte: string;
  enlace_acceso_plataforma: string;
}

const loadLinksData = async (): Promise<LinksDataResponse | undefined> => {
  const response = await AxiosGet("/api/links/");

  return response?.data;
};

export default loadLinksData;

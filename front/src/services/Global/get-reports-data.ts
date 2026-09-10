import { AxiosGet } from "services/utils";

export interface ReportDataResponse {
  id: string;
  nombre: string;
  descripcion: string;
  area: string;
  productOwner: string;
  iframe: string;
  kpis: string[];
  fechaModificacion: string;
}

const loadReportsData = async (): Promise<ReportDataResponse[] | undefined> => {
  const response = await AxiosGet("/api/reports/");

  return response?.data;
};

export default loadReportsData;

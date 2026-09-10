import { AxiosPost } from "services/utils";

import { ReportModel } from "models/Global/reportsModel";

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

export interface ReportDataCreation {
  id: string;
  nombre: string;
  descripcion: string;
  area: string;
  productOwner: string;
  iframe: string;
  kpis: string[];
}

const ReportModelToData = (reportData: ReportModel): ReportDataCreation => {
  return {
    id: reportData.id,
    nombre: reportData.nombre,
    descripcion: reportData.descripcion,
    area: reportData.area,
    productOwner: reportData.productOwner,
    iframe: reportData.iframe,
    kpis: reportData.kpis,
  };
};

const createReportData = async (
  data: ReportModel,
): Promise<ReportDataResponse | undefined> => {
  const response = await AxiosPost("/api/reports/", ReportModelToData(data));

  return response?.data;
};

export default createReportData;

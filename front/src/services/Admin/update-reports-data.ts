import { AxiosPut } from "services/utils";

import { ReportModel } from "models/Global/reportsModel";

export interface ReportDataResponse {
  id: string;
  nombre: string;
  descripcion: string;
  area: string;
  iframe: string;
  kpis: string[];
  fechaModificacion: string;
}

const ReportModelToData = (reportData: ReportModel): ReportDataResponse => {
  return {
    id: reportData.id,
    nombre: reportData.nombre,
    descripcion: reportData.descripcion,
    area: reportData.area,
    iframe: reportData.iframe,
    kpis: reportData.kpis,
    fechaModificacion: reportData.fechaModificacion,
  };
};

const updateReportData = async (
  data: ReportModel,
): Promise<ReportDataResponse | undefined> => {
  const response = await AxiosPut(
    `/api/reports/${data.id}`,
    ReportModelToData(data),
  );

  return response?.data;
};

export default updateReportData;

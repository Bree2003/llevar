import { ReportDataResponse } from "services/Global/get-reports-data";

export interface ReportModel {
  id: string;
  nombre: string;
  descripcion: string;
  area: string;
  productOwner: string;
  iframe: string;
  kpis: string[];
  fechaModificacion: string;
}

export const ReportDataToModel = (
  report: ReportDataResponse | undefined,
): ReportModel | null => {
  return report
    ? {
        id: report.id,
        nombre: report.nombre,
        descripcion: report.descripcion,
        area: report.area,
        productOwner: report.productOwner,
        iframe: report.iframe,
        kpis: report.kpis,
        fechaModificacion: report.fechaModificacion,
      }
    : null;
};

export const ReportsDataToModel = (
  reports: ReportDataResponse[] | undefined,
): ReportModel[] => {
  return reports
    ? reports.map((report) => ({
        id: report.id,
        nombre: report.nombre,
        descripcion: report.descripcion,
        area: report.area,
        productOwner: report.productOwner,
        iframe: report.iframe,
        kpis: report.kpis,
        fechaModificacion: report.fechaModificacion,
      }))
    : [];
};

import { useEffect, useState } from "react";

import {
  ReportModel,
  ReportDataToModel,
  ReportsDataToModel,
} from "models/Global/reportsModel";
import {
  DomainModel,
  DomainsDataToModel
} from "models/Global/domainsModel";
import loadReportsData from "services/Global/get-reports-data";
import loadDomainsData from "services/Global/get-domains-data";
import deleteReportsData from "services/Admin/delete-reports-data";

import AdminMarketplaceScreen from "screens/Admin/AdminMarketplaceScreen";
import createReportData from "services/Admin/create-reports-data";
import updateReportData from "services/Admin/update-reports-data";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName =
  | "loadReports"
  | "loadDomains"
  | "createReport"
  | "updateReport"
  | "deleteReport";

export interface Model {
  reports: ReportModel[] | undefined;
  domains: DomainModel[] | undefined;
  lastUpdate: Date | undefined;
}

const AdminMarketplaceController = () => {
  const [model, setModel] = useState<Partial<Model>>();

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadReports();
    loadDomains();
  }, []);

  const updateModel = (
    partialModel:
      | Partial<Model>
      | ((model: Partial<Model> | undefined) => Partial<Model>),
  ) => {
    setModel((prev) => {
      const newModel =
        typeof partialModel === "function" ? partialModel(prev) : partialModel;

      return {
        ...prev,
        lastUpdate: new Date(),
        ...newModel,
      };
    });
  };

  const setEndpointStatus = (
    endpoint: EndpointName,
    status: Partial<EndpointStatus>,
  ) => {
    setEndpoints((prev) => ({
      ...prev,

      [endpoint]: {
        ...prev?.[endpoint],
        ...status,
      },
    }));
  };

  const buildStatusEndpoint = (name: EndpointName) => ({
    loading() {
      setEndpointStatus(name, {
        loading: true,
        error: false,
      });
    },

    error() {
      setEndpointStatus(name, {
        loading: false,
        error: true,
      });
    },

    done() {
      setEndpointStatus(name, {
        loading: false,
      });
    },
  });

  const loadReports = async () => {
    const statusEndpoint = buildStatusEndpoint("loadReports");

    try {
      statusEndpoint.loading();

      const response = await loadReportsData();

      const reports = ReportsDataToModel(response);

      updateModel({
        reports,
      });
    } catch (e) {
      console.error("Error al cargar reportes:", e);

      statusEndpoint.error();

      updateModel({
        reports: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadDomains = async () => {
    const statusEndpoint = buildStatusEndpoint("loadDomains");

    try {
      statusEndpoint.loading();

      const response = await loadDomainsData();

      const domains = DomainsDataToModel(response);

      updateModel({
        domains,
      });
    } catch (e) {
      console.error("Error al cargar dominios:", e);

      statusEndpoint.error();

      updateModel({
        domains: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  const createReport = async (report: ReportModel) => {
    const statusEndpoint = buildStatusEndpoint("createReport");

    try {
      statusEndpoint.loading();

      const response = await createReportData(report);

      const newReport = ReportDataToModel(response);

      if (newReport) {
        updateModel((currentModel) => ({
          reports: [...(currentModel?.reports || []), newReport],
        }));
      }
    } catch (e) {
      console.error("Error al crear reporte:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updateReport = async (report: ReportModel) => {
    const statusEndpoint = buildStatusEndpoint("updateReport");

    try {
      statusEndpoint.loading();

      const response = await updateReportData(report);

      const updatedReport = ReportDataToModel(response);

      if (updatedReport) {
        updateModel((currentModel) => ({
          reports:
            currentModel?.reports?.map((currentReport) =>
              currentReport.id === updatedReport.id
                ? updatedReport
                : currentReport,
            ) || [],
        }));
      }
    } catch (e) {
      console.error("Error al actualizar reporte:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const deleteReport = async (report: ReportModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteReport");

    try {
      statusEndpoint.loading();

      await deleteReportsData(report);

      updateModel((currentModel) => ({
        reports:
          currentModel?.reports?.filter(
            (currentReport) => currentReport.id !== report.id,
          ) || [],
      }));
    } catch (e) {
      console.error("Error al eliminar reporte:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  return (
    <AdminMarketplaceScreen
      model={model}
      endpoints={endpoints}
      handleReportCreate={createReport}
      handleReportUpdate={updateReport}
      handleReportDelete={deleteReport}
    />
  );
};

export default AdminMarketplaceController;

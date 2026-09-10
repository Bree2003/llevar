import { useEffect, useState } from "react";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";

import { LinksModel, LinksDataToModel } from "models/Global/linksModel";

import loadReportsData from "services/Global/get-reports-data";
import loadLinksData from "services/Global/get-links-data";

import ReportScreen from "screens/Marketplace/ReportScreen";

const ReportController = () => {
  const [reports, setReports] = useState<ReportModel[]>([]);

  const [links, setLinks] = useState<LinksModel | undefined>();

  const [isLoading, setIsLoading] = useState(true);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadReports();
    loadLinks();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const response = await loadReportsData();

      const reportsData = ReportsDataToModel(response);

      setReports(reportsData);
    } catch (error) {
      console.error("Error al cargar reporte:", error);

      setReports([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLinks = async () => {
    try {
      const response = await loadLinksData();

      const linksData = LinksDataToModel(response);

      setLinks(linksData ?? undefined);
    } catch (error) {
      console.error("Error al cargar enlaces:", error);

      setLinks(undefined);
    }
  };

  return (
    <ReportScreen
      reports={reports}
      links={links}
      isLoading={isLoading}
      hasError={hasError}
    />
  );
};

export default ReportController;

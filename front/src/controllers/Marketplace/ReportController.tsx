import { useEffect, useState } from "react";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";

import loadReportsData from "services/Global/get-reports-data";

import ReportScreen from "screens/Marketplace/ReportScreen";

const ReportController = () => {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadReports();
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

  return (
    <ReportScreen reports={reports} isLoading={isLoading} hasError={hasError} />
  );
};

export default ReportController;

import { useEffect, useState } from "react";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";

import loadReportsData from "services/Global/get-reports-data";

import MarketplaceScreen from "screens/Marketplace/screen";

const MarketplaceController = () => {
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
      console.error("Error al cargar reportes del marketplace:", error);

      setReports([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketplaceScreen
      reports={reports}
      isLoading={isLoading}
      hasError={hasError}
    />
  );
};

export default MarketplaceController;

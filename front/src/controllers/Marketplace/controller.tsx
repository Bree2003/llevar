import { useEffect, useState } from "react";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";
import { DomainModel, DomainsDataToModel } from "models/Global/domainsModel";

import loadReportsData from "services/Global/get-reports-data";
import loadDomainsData from "services/Global/get-domains-data";
import MarketplaceScreen from "screens/Marketplace/screen";

const MarketplaceController = () => {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [domains, setDomains] = useState<DomainModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadDomains();
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

  const loadDomains = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const response = await loadDomainsData();

      const domainData = DomainsDataToModel(response);

      setDomains(domainData);
    } catch (error) {
      console.error("Error al cargar los dominios:", error);

      setDomains([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketplaceScreen
      reports={reports}
      domains={domains}
      isLoading={isLoading}
      hasError={hasError}
    />
  );
};

export default MarketplaceController;

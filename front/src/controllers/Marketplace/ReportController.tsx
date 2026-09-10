import { useEffect, useState } from "react";

import { ReportModel, ReportsDataToModel } from "models/Global/reportsModel";

import { DomainModel, DomainsDataToModel } from "models/Global/domainsModel";

import { LinksModel, LinksDataToModel } from "models/Global/linksModel";

import loadReportsData from "services/Global/get-reports-data";
import loadDomainsData from "services/Global/get-domains-data";
import loadLinksData from "services/Global/get-links-data";

import ReportScreen from "screens/Marketplace/ReportScreen";

const ReportController = () => {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [domains, setDomains] = useState<DomainModel[]>([]);
  const [links, setLinks] = useState<LinksModel | undefined>();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadData();
    loadLinks();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const [reportsResponse, domainsResponse] = await Promise.all([
        loadReportsData(),
        loadDomainsData(),
      ]);

      const reportsData = ReportsDataToModel(reportsResponse);
      const domainsData = DomainsDataToModel(domainsResponse);

      setReports(reportsData);
      setDomains(domainsData);
    } catch (error) {
      console.error("Error al cargar información del reporte:", error);

      setReports([]);
      setDomains([]);
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
      domains={domains}
      links={links}
      isLoading={isLoading}
      hasError={hasError}
    />
  );
};

export default ReportController;

import { AxiosPut } from "services/utils";

import { LinksModel } from "models/Global/linksModel";

export interface LinksDataResponse {
  enlace_acceso_reporte: string;
  enlace_soporte: string;
  enlace_acceso_plataforma: string;
}

export interface LinksDataUpdate {
  enlace_acceso_reporte: string;
  enlace_soporte: string;
  enlace_acceso_plataforma: string;
}

const LinksModelToData = (linksData: LinksModel): LinksDataUpdate => {
  return {
    enlace_acceso_reporte: linksData.enlaceAccesoReporte,

    enlace_soporte: linksData.enlaceSoporte,

    enlace_acceso_plataforma: linksData.enlaceAccesoPlataforma,
  };
};

const updateLinksData = async (
  data: LinksModel,
): Promise<LinksDataResponse | undefined> => {
  const response = await AxiosPut("/api/links/", LinksModelToData(data));

  return response?.data;
};

export default updateLinksData;

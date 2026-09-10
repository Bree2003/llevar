import { LinksDataResponse } from "services/Global/get-links-data";

export interface LinksModel {
  enlaceAccesoReporte: string;
  enlaceSoporte: string;
  enlaceAccesoPlataforma: string;
}

export const LinksDataToModel = (
  links: LinksDataResponse | undefined,
): LinksModel | null => {
  return links
    ? {
        enlaceAccesoReporte: links.enlace_acceso_reporte,
        enlaceSoporte: links.enlace_soporte,
        enlaceAccesoPlataforma: links.enlace_acceso_plataforma,
      }
    : null;
};

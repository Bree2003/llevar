import { ProductModel } from "models/Ingest/product-model";
import { EnvironmentModel } from "models/Ingest/environment-model";
import { getValidSapModuleLabel, formatProductName } from "utils/formatting-utils";

export type SearchType = 'module' | 'product';

export interface SearchSuggestion {
  id: string;
  label: string;
  type: SearchType;
  subLabel?: string;
  routeParams: {
    envId?: string;
    bucketName?: string;
    productName?: string;
  };
}

/**
 * Adapta los Buckets de SAP para el buscador.
 * FILTRA: Solo pasan los que cumplen el patrón de Módulo.
 */
export const SapBucketsToSearchAdapter = (environments: EnvironmentModel[]): SearchSuggestion[] => {
  const suggestions: SearchSuggestion[] = [];

  // Buscamos solo el entorno SAP
  const sapEnv = environments.find(e => e.id === 'sap');

  if (sapEnv) {
    sapEnv.buckets.forEach(bucket => {
      // 1. Intentamos obtener el label bonito
      const niceLabel = getValidSapModuleLabel(bucket);

      // 2. SOLO si es válido (no es null), lo agregamos
      if (niceLabel) {
        suggestions.push({
          id: bucket,
          label: niceLabel, // "Módulo MM", "Módulo SD", etc.
          type: 'module',
          routeParams: {
            envId: sapEnv.id,
            bucketName: bucket
          }
        });
      }
    });
  }

  return suggestions;
};

/**
 * Adapta los Productos de Datos.
 */
export const ProductsToSearchAdapter = (
    products: ProductModel[], 
    envId: string, 
    bucketName: string
): SearchSuggestion[] => {
    
  return products.map(p => ({
    id: p.id,
    label: formatProductName(p.label), // "Programa De Fabricación"
    type: 'product',
    subLabel: envId === 'pd' ? 'Producto de Datos' : undefined,
    routeParams: {
      envId,
      bucketName,
      productName: p.id
    }
  }));
};
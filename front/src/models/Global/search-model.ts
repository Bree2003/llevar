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

export const SapBucketsToSearchAdapter = (environments: EnvironmentModel[]): SearchSuggestion[] => {
  const suggestions: SearchSuggestion[] = [];

  const sapEnv = environments.find(e => e.id === 'sap');

  if (sapEnv) {
    sapEnv.buckets.forEach(bucket => {
      const niceLabel = getValidSapModuleLabel(bucket);

      if (niceLabel) {
        suggestions.push({
          id: bucket,
          label: niceLabel,
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

export const ProductsToSearchAdapter = (
    products: ProductModel[], 
    envId: string, 
    bucketName: string
): SearchSuggestion[] => {
    
  return products.map(p => ({
    id: p.id,
    label: formatProductName(p.label),
    type: 'product',
    subLabel: envId === 'pd' ? 'Producto de Datos' : undefined,
    routeParams: {
      envId,
      bucketName,
      productName: p.id
    }
  }));
};
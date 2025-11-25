import { ProductsResponse } from "services/Ingest/product-service";

export interface ProductModel {
  id: string;    // Usaremos el mismo nombre como ID
  label: string; // Nombre visual
}

const ProductAdapter = (data: ProductsResponse): ProductModel[] => {
  if (!data || !data.data_products) return [];

  return data.data_products.map((productName) => ({
    id: productName,
    label: productName,
  }));
};

export default ProductAdapter;
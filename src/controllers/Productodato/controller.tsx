// screens/ProductoController.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as storageService from "services/storage-old";
import * as storageModel from "models/storageModel-old";
import ProductoDatoScreen from "screens/ProductoDato/ProductoDato";
import Loading from "components/Global/Loading/Loading"; // Puedes eliminar esta línea

export interface Model {
  datasets: string[];
  productName: string;
}

const ProductoController = () => {
  const { productName: productSlug } = useParams<{ productName: string }>();
  const productName = productSlug?.replace(/-/g, '_');

  const [model, setModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!productName) {
        // ... (código de error sin cambios)
        return;
      }
      try {
        // --- NOVEDAD: Al iniciar la carga, si no hay modelo previo, seteamos uno vacío ---
        // Esto evita que la pantalla intente renderizar `model.productName` cuando es null
        // y permite que los esqueletos se muestren correctamente desde el principio.
        setIsLoading(true);
        if (!model) {
          setModel({ datasets: [], productName });
        }
        setError(null);
        
        const datasetsResponse = await storageService.loadDatasetsInProduct(productName);
        
        const datasetsRaw = storageModel.DatasetsToModel(datasetsResponse);
        const datasets = datasetsRaw.map(dataset => dataset.replace('.parquet', '').replace('.csv', ''));
        
        setModel({ 
          datasets, 
          productName,
        });

      } catch (err: any) {
        setError(err.message || "Ocurrió un error al cargar los datos del producto.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productName]);

  // --- RECOMENDACIÓN: Eliminar el return del Loading global ---
  // if (isLoading) {
  //   return <Loading message={`Cargando datos para ${productName}...`} />;
  // }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!model) {
      // Este caso solo se daría si hay un error antes de la primera carga
      return <div>Preparando datos del producto...</div>
  }

  // --- CAMBIO CLAVE ---
  // Ahora pasamos tanto el 'model' como el estado 'isLoading' a la Screen.
  return (
    <ProductoDatoScreen model={model} isLoading={isLoading} />
  );
};

export default ProductoController;
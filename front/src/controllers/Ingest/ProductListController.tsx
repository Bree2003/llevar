import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // La crearemos abajo

import ProductAdapter, { ProductModel } from "models/Ingest/product-model";
import { getProductsService } from "services/Ingest/product-service";
import ProductListScreen from "screens/Ingest/ProductListScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName = "GetProducts";

export interface ProductsStateModel {
  products: ProductModel[];
  envId: string;
  bucketName: string;
}

const ProductListController = () => {
  const params = useParams(); // Capturamos todo el objeto primero

  // --- AGREGA ESTO ---
  console.log("PARAMETROS URL:", params);
  console.log("Env:", params.envId, "Bucket:", params.bucketName);
  // 1. Leemos los parámetros de la URL
  const { envId, bucketName } = useParams();
  const navigate = useNavigate();

  // 2. Estado
  const [model, setModel] = useState<Partial<ProductsStateModel>>({
    products: [],
    envId: envId,
    bucketName: bucketName,
  });

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  // 3. Efecto de carga
  useEffect(() => {
    if (envId && bucketName) {
      loadProducts();
    }
  }, [envId, bucketName]);

  // Helpers
  const setEndpointStatus = (
    name: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [name]: { ...prev?.[name], ...status },
    }));
  };

  const updateModel = (data: Partial<ProductsStateModel>) => {
    setModel((prev) => ({ ...prev, ...data }));
  };

  // 4. Lógica de Negocio
  const loadProducts = async () => {
    if (!envId || !bucketName) return;

    setEndpointStatus("GetProducts", { loading: true, error: false });

    try {
      const response = await getProductsService(envId, bucketName);
      const cleanProducts = ProductAdapter(response);

      updateModel({ products: cleanProducts });
    } catch (e) {
      console.error(e);
      setEndpointStatus("GetProducts", { error: true });
    } finally {
      setEndpointStatus("GetProducts", { loading: false });
    }
  };

  // 5. Navegación al siguiente paso (Carpetas/Tablas)
  const handleSelectProduct = (productName: string) => {
    // Navegamos a la siguiente vista: Lista de carpetas dentro del producto
    // Ruta sugerida: /sap/bucket-raw/producto-x/folders
    navigate(`/dashboard/${envId}/${bucketName}/${productName}/folders`);
  };

  const handleBack = () => navigate(-1);

  return (
    <ProductListScreen
      model={model}
      endpoints={endpoints}
      onSelectProduct={handleSelectProduct}
      onBack={handleBack}
    />
  );
};

export default ProductListController;

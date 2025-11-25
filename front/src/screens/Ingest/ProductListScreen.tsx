import ProductDisplayGrid from "components/DataProduct/ProductDisplayGrid";
import {
  EndpointName,
  EndpointStatus,
  ProductsStateModel,
} from "controllers/Ingest/ProductListController";

interface Props {
  model: Partial<ProductsStateModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onSelectProduct: (productName: string) => void;
  onBack: () => void;
}

const ProductListScreen = ({
  model,
  endpoints,
  onSelectProduct,
  onBack,
}: Props) => {
  const isLoading = endpoints?.GetProducts?.loading;

  return (
    <div className="w-full">
      {/* El botón 'Volver' se queda aquí, ya que controla la navegación de la página */}

      
      {/* --- CAMBIO CLAVE: El Screen ahora solo renderiza el componente de presentación --- */}
      <ProductDisplayGrid
        products={model?.products || []}
        loading={isLoading}
        onProductClick={onSelectProduct}
        // Le pasamos el nombre del bucket para que lo renderice internamente
        bucketName={model?.bucketName}
      />
    </div>
  );
};

export default ProductListScreen;
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
<div className="pt-5 pl-10"> {/* Contenedor y separador */}
        <button
            onClick={onBack}
            className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm
                       text-orange-600 border border-orange-300
                       hover:bg-orange-50 hover:border-orange-400 hover:shadow-md
                       text-sm font-semibold transition-all duration-200 justify-start"
        >
            <span className="mr-2 text-lg">←</span> {/* Flecha un poco más grande */}
            Volver a dominios
        </button>
    </div>
      
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
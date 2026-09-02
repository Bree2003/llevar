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
    <main className="w-full min-h-full text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Volver */}
        <button
          type="button"
          onClick={onBack}
          className="
            flex
            items-center
            gap-2
            text-sm
            md:text-base
            font-semibold
            text-[--color-text-secondary]
            hover:text-[--color-accent]
            transition-colors
          "
        >
          <span className="text-lg">←</span>
          Volver a módulos
        </button>

        {/* Header */}
        <section className="w-full mt-5 md:mt-6">
          <h1
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-bold
              text-[--color-accent]
            "
          >
            Productos de Datos
          </h1>

          <p
            className="
              mt-4
              md:mt-6
              max-w-4xl
              text-base
              md:text-lg
              font-medium
              leading-relaxed
              text-[--color-text-secondary]
            "
          >
            Explora los productos de datos disponibles y accede a la información
            necesaria para gestionar, analizar y utilizar los datos del negocio.
          </p>
        </section>

        {/* Productos */}
        <section className="w-full mt-8 md:mt-10">
          <ProductDisplayGrid
            products={model?.products || []}
            loading={isLoading}
            onProductClick={onSelectProduct}
            bucketName={model?.bucketName}
          />
        </section>
      </div>
    </main>
  );
};

export default ProductListScreen;

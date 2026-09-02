import {
  EndpointName,
  EndpointStatus,
  IngestModel,
} from "controllers/Ingest/controller";

import QuickAccess from "components/QuickAccess/QuickAccess";
import DataProduct from "components/DataProduct/DataProduct";

interface Props {
  model: Partial<IngestModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onSelectEnvironment: (envId: string) => void;
}

const IngestScreen = ({ model, endpoints, onSelectEnvironment }: Props) => {
  const isLoading = endpoints?.GetEnvironments?.loading;

  return (
    <main
      className="
        w-full
        min-h-full
        text-left
        py-6
        md:py-8
      "
    >
      <div
        className="
          w-full
          max-w-[1600px]
          mx-auto
          px-4
          md:px-6
          lg:px-8
        "
      >
        {/* Header */}
        <section className="w-full">
          <h1
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-bold
              text-[--color-accent]
            "
          >
            Ingestas
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
            Gestiona la incorporación y actualización de información de los
            distintos dominios de datos de la organización.
          </p>
        </section>

        {/* Contenido */}
        <section
          className="
            w-full
            mt-8
            md:mt-10

            grid
            grid-cols-1

            xl:grid-cols-[minmax(0,1fr)_320px]
            2xl:grid-cols-[minmax(0,1fr)_380px]

            gap-6
            md:gap-8

            items-start
          "
        >
          <DataProduct
            products={model?.environments || []}
            loading={isLoading}
            onProductClick={onSelectEnvironment}
          />

          <QuickAccess />
        </section>
      </div>
    </main>
  );
};

export default IngestScreen;

import {
  EndpointName,
  EndpointStatus,
  BucketListModel,
} from "controllers/Ingest/BucketListController";

import Loading from "components/Global/Loading/Loading";
import ProductCardGrid from "components/DataProduct/BucketGrid";

interface Props {
  model: Partial<BucketListModel> | undefined;

  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;

  onBack: () => void;

  onSelectBucket: (bucketName: string) => void;
}

const BucketListScreen = ({
  model,
  endpoints,
  onBack,
  onSelectBucket,
}: Props) => {
  const isLoading = endpoints?.GetBuckets?.loading;

  /*
   * Carga inicial
   */
  if (isLoading && !model?.buckets) {
    return (
      <div
        className="
          w-full
          text-left

          p-4
          md:p-6
          lg:p-10
        "
      >
        <button
          type="button"
          onClick={onBack}
          className="
            mb-6

            flex
            items-center
            gap-2

            text-sm
            font-semibold

            text-[--color-accent]

            hover:opacity-80

            transition-opacity
          "
        >
          <span className="text-lg">←</span>
          Volver a dominios
        </button>

        <Loading message="Cargando módulos..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Volver */}
      <div
        className="
          pt-5

          px-4
          md:px-6
          lg:pl-10
        "
      >
        <button
          type="button"
          onClick={onBack}
          className="
            flex
            items-center
            justify-start
            gap-2

            px-4
            py-2.5

            bg-white

            rounded-[10px]

            border
            border-[--color-border]

            text-[--color-accent]
            text-sm
            font-semibold

            hover:bg-[--color-accent-light]
            hover:border-[--color-accent]

            transition-colors
            duration-200
          "
        >
          <span className="text-lg">←</span>
          Volver a dominios
        </button>
      </div>

      {/* Módulos */}
      <ProductCardGrid
        title={`${model?.environmentName || "..."}`}
        items={model?.buckets || []}
        loading={isLoading}
        onItemClick={onSelectBucket}
      />
    </div>
  );
};

export default BucketListScreen;

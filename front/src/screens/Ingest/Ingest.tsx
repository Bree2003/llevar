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
    <div
      className="
        w-full
        h-full
        min-h-full

        flex
        flex-col
      "
    >
      <div
        className="
          w-full
          flex-1
          min-h-0

          flex
          items-stretch
        "
      >
        <DataProduct
          products={model?.environments || []}
          loading={isLoading}
          onProductClick={onSelectEnvironment}
        />

        <QuickAccess />
      </div>
    </div>
  );
};

export default IngestScreen;

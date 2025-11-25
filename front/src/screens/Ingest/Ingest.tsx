import {
  EndpointName,
  EndpointStatus,
  IngestModel,
} from "controllers/Ingest/controller";
import Loading from "components/Global/Loading/Loading";
import QuickAccess from "components/QuickAccess/QuickAccess";
import DataProduct from "components/DataProduct/DataProduct"; // 1. Importamos el componente de diseño

interface Props {
  model: Partial<IngestModel> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  onSelectEnvironment: (envId: string) => void;
}

const IngestScreen = ({ model, endpoints, onSelectEnvironment }: Props) => {
  const isLoading = endpoints?.GetEnvironments?.loading;

  return (
    <div className="flex flex-col w-full">
      {/* El título se puede mantener aquí o moverlo dentro de DataProduct si se prefiere */}
      {/* 2. Reemplazamos el .map() por el componente DataProduct */}
      <div className="flex-grow w-full flex">
        <DataProduct
          // Le pasamos el array completo de entornos. El "|| []" evita errores si es undefined.
          products={model?.environments || []}
          loading={isLoading}
          // Le pasamos la función que se debe ejecutar al hacer clic en una tarjeta.
          onProductClick={onSelectEnvironment}
        />
        <QuickAccess />
      </div>
    </div>
  );
};

export default IngestScreen;
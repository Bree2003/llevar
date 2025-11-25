import {
  EndpointName,
  EndpointStatus,
  BucketListModel,
} from "controllers/Ingest/BucketListController";
import Loading from "components/Global/Loading/Loading";
import ProductCardGrid from "components/DataProduct/BucketGrid";
// --- NUEVO: Importamos nuestro nuevo componente de diseño ---

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

  // El estado de carga inicial (pantalla completa) se puede manejar aquí
  if (isLoading && !model?.buckets) {
      return (
          <div className="p-10">
              <button onClick={onBack} className="mb-4 text-sm text-blue-600 hover:underline flex items-center">
                  ← Volver a Dominios
              </button>
              <Loading message="Cargando buckets..." />
          </div>
      );
  }

  return (
    <div className="w-full"> {/* Usamos w-full para que el componente interno se expanda */}
      {/* Botón de volver y elementos fuera de la grilla se quedan aquí */}

      {/* --- CAMBIO CLAVE: Usamos el nuevo componente para mostrar todo --- */}
      <ProductCardGrid

        // Le pasamos el título dinámico
        title={`Buckets de ${model?.environmentName || '...'}`}
        // Le pasamos el array de strings
        items={model?.buckets || []}
        loading={isLoading}
        // Le pasamos la función callback
        onItemClick={onSelectBucket}
      />
    </div>
  );
};

export default BucketListScreen;
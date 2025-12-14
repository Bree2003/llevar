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
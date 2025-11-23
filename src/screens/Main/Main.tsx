// screens/Main/Main.tsx
import {
  EndpointName,
  EndpointStatus,
  Model,
} from "controllers/Main/controller";
import Loading from "components/Global/Loading/Loading";
import QuickAccess from "components/QuickAccess/QuickAccess";
import DataProduct from "components/DataProduct/DataProduct"; // Renombraremos esto a "EnvironmentList" o similar a futuro

const MainScreen = ({
  model,
  endpoints,
}: {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
}) => {
  // Obtenemos el estado de carga específico para los entornos
  const isLoading = endpoints?.LoadEnvironments?.loading || false;
console.log(model?.environments);
  return (
    <main className="flex flex-col w-full">
      {/* Mostramos el loading si el endpoint está cargando */}
      {isLoading && <Loading message="Cargando la información de entornos..." />}
      
      <div className="flex-grow w-full flex">
        {/*
          Aquí es donde mostrarías la lista de entornos.
          Por ahora, podemos reutilizar tu componente DataProduct
          pasándole los nombres de los entornos.
        */}
        <DataProduct
          // Le pasamos los nombres de los entornos para que los liste
          products={model?.environments?.map(env => env.name) || []}
          loading={isLoading}
        />
        <QuickAccess />
      </div>
    </main>
  );
};

export default MainScreen;
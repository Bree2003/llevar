import {
  EndpointName,
  EndpointStatus,
  Model,
} from "controllers/Main/controller";
import { useSnackbar, VariantType } from "notistack";
import { closeSnackbarAction } from "constants/helpers";
import Loading from "components/Global/Loading/Loading";
import QuickAccess from "components/QuickAccess/QuickAccess";
import DataProduct from "components/DataProduct/DataProduct";

const MainScreen = ({
  model,
  endpoints,
}: {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleOnSnackbar = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant: variant,
      persist: true,
      action: closeSnackbarAction,
    });
  };

  const handleLoading = () => {
    for (const key in endpoints) {
      if (endpoints[key as EndpointName]?.loading) {
        return true;
      }
    }
    return false;
  };

  return (
    <main className="flex flex-col w-full">
      {handleLoading() ? <Loading message="Cargando la información" /> : <></>}
      <div className="flex-grow w-full flex">
        <DataProduct />
        <QuickAccess />
      </div>
    </main>
  );
};

export default MainScreen;

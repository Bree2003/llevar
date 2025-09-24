import {
  EndpointName,
  EndpointStatus,
  Model,
} from "controllers/Main/controller";
import { useSnackbar, VariantType } from "notistack";
import { closeSnackbarAction } from "constants/helpers";
import Loading from "components/Global/Loading/Loading";
import Footer from "components/Footer/Footer";
import Navbar from "components/Navbar/Navbar";


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
  }

  return (
    <main className="flex flex-col w-full max-md:max-w-full">
      {
        handleLoading() ? (
          <Loading
            message="Cargando la información"
          />
        ) : (
          <></>
        )
      }
      <Navbar/>
      <div>
        React Example
      </div>
      <Footer />
    </main>
  );
};

export default MainScreen;

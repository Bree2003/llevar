// src/screens/Fabricacion/FabricacionScreen.tsx
import Loading from "components/Global/Loading/Loading";
import IngestaArchivos from "components/IngestaArchivos/IngestaArchivos";
import MenuLateral from "components/MenuLateral/MenuLateral";
import ResumenProducto from "components/ResumenProducto/ResumenProducto";

// Importa los componentes específicos para esta pantalla

// const FabricacionScreen = ({ model, endpoints }) => {
const FabricacionScreen = () => {
  // ... (lógica de handleLoading y handleOnSnackbar, igual que en MainScreen)

  return (
    <main className="flex flex-col w-full">
      {/* {handleLoading() ? <Loading message="Cargando programa..." /> : <></>} */}
      <div className="flex-grow w-full flex">
        <MenuLateral />
        <div className="p-10">
        <ResumenProducto />
        <IngestaArchivos />
        </div>
      </div>
    </main>
  );
};

export default FabricacionScreen;
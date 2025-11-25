// screens/ProductoDato/ProductoDato.tsx

import IngestaArchivos from "components/IngestaArchivos/IngestaArchivos";
import MenuLateral from "components/MenuLateral/MenuLateral";
import ResumenProducto from "components/ResumenProducto/ResumenProducto";
import { Model as ProductoControllerModel } from "controllers/Productodato/controller";

// --- NOVEDAD: Definimos las props que espera esta pantalla ---
interface ProductoDatoScreenProps {
  model: ProductoControllerModel;
  isLoading: boolean; // Recibimos el estado de carga
}

// La pantalla ahora es un componente funcional simple que recibe props
const ProductoDatoScreen = ({ model, isLoading }: ProductoDatoScreenProps) => {
  return (
    <div className="flex w-full h-full">
      {/* --- CAMBIO CLAVE --- */}
      {/* Pasamos la prop 'loading' directamente a MenuLateral */}
      <MenuLateral
        activeProduct={model.productName}
        datasets={model.datasets}
        loading={isLoading}
      />

      <main className="flex flex-grow flex-col p-10 w-full">
        {/* Pasamos a cada componente solo las props que necesita */}
        <ResumenProducto 
          productName={model.productName}
        />
        <IngestaArchivos 
          productName={model.productName}
          datasets={model.datasets}
        />
      </main>
    </div>
  );
};

export default ProductoDatoScreen;
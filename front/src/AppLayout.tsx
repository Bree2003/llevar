import { Outlet, useLocation } from "react-router-dom"; // 1. Importar useLocation
import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";

const AppLayout = () => {
  // 2. Obtener la ubicación actual (la URL)
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-grow w-full">
        {/* 3. APLICAR LA KEY AQUÍ:
           Al usar location.pathname, cada vez que cambie la ruta, 
           React desmontará el componente anterior y montará el nuevo 
           completamente limpio. 
        */}
        <div key={location.pathname} className="w-full flex flex-col">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;

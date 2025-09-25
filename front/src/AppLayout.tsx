// src/components/Layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar/Navbar"; // Asegúrate de que la ruta sea correcta
import Footer from "components/Footer/Footer"; // Asegúrate de que la ruta sea correcta

const AppLayout = () => {
  return (
    // Esta estructura con flexbox ayuda a que el footer se mantenga abajo
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* El <main> es el contenido principal que cambiará en cada ruta */}
      <main className="flex flex-grow w-full">
        {/* Aquí es donde React Router renderizará los componentes de las rutas hijas */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;

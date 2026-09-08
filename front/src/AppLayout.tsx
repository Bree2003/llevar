import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "components/Layout/Footer";
import LateralMenu from "components/Layout/LateralMenu";
import Navbar from "components/Layout/Navbar";
import ProductSidebar from "components/DataProduct/ProductSidebar";
import {
  ProductSidebarProvider,
  useProductSidebar,
} from "components/Layout/LateralMenu/ProductSidebarContext";

const NAVBAR_HEIGHT = 85.33;

const AppLayoutContent = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { sidebar } = useProductSidebar();

  return (
    <div className="h-screen overflow-hidden bg-[--color-background]">
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Área inferior al Navbar */}
      <div
        className="flex w-full overflow-hidden"
        style={{
          paddingTop: `${NAVBAR_HEIGHT}px`,
          height: "100vh",
        }}
      >
        {/* Menú lateral principal */}
        <div className="h-full flex-shrink-0 z-40">
          <LateralMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>

        {/*
          Zona derecha del menú principal.
          En desktop, ProductSidebar queda inmediatamente al lado del LateralMenu.
          En pantallas pequeñas, queda arriba del contenido de la ruta.
        */}
        <div className="flex-1 min-w-0 h-full flex flex-col lg:flex-row overflow-hidden">
          {sidebar && (
            <div className="w-full lg:w-auto flex-shrink-0">
              <ProductSidebar
                envId={sidebar.envId}
                productName={sidebar.productName}
                tables={sidebar.tables}
                loading={sidebar.loading}
                onSelectTable={sidebar.onSelectTable}
                onBack={sidebar.onBack}
              />
            </div>
          )}

          {/* Contenido de la ruta */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto">
            <div key={location.pathname} className="min-h-full flex flex-col">
              <main className="flex-1 flex justify-center">
                <div className="w-full max-w-[1800px]">
                  <Outlet />
                </div>
              </main>

              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <ProductSidebarProvider>
      <AppLayoutContent />
    </ProductSidebarProvider>
  );
};

export default AppLayout;

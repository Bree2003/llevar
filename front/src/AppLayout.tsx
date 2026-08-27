import { Outlet, useLocation } from "react-router-dom";
import Footer from "components/Layout/Footer";
import LateralMenu from "components/Layout/LateralMenu";
import { useState } from "react";
import Navbar from "components/Layout/Navbar";

const NAVBAR_HEIGHT = 85.33;

const AppLayout = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const isHome = location.pathname === "/home";

  return (
    <div className="h-screen overflow-hidden">
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar fija */}
      <div
        className="fixed left-0 z-40"
        style={{
          top: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <LateralMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      </div>

      {/* Contenido */}
      <div
        style={{
          marginLeft: isHome
            ? "0"
            : isMenuOpen
              ? "250px"
              : "60px",
          marginTop: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          transition: "margin-left 300ms ease-in-out"
        }}
      >
        <div
          key={location.pathname}
          className="h-full overflow-y-auto flex flex-col"
        >
          <main className="flex-1 flex justify-center">
            <div className="w-full max-w-[1800px]">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div >
  );
};

export default AppLayout;
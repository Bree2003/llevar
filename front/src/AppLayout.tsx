import { Outlet, useLocation } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-grow w-full">
        <div key={location.pathname} className="w-full flex flex-col">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;

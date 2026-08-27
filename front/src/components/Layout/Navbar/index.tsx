import { ReactComponent as Profile } from "components/Global/Icons/profile.svg";
import SearchController from "controllers/Global/SearchController";
import { useLocation } from "react-router";

const Navbar = () => {

  const location = useLocation();

  const showSearch = location.pathname.startsWith("/dashboard");

  return (
    <nav className="bg-[--color-grafito] flex justify-start items-center p-6">
      {/* Logo */}
      <a href="/home" className="flex items-center">
        <img
          src="/images/logo-blanco.png"
          alt="Logo Concha y Toro"
          className="h-7"
        />
      </a>

      <div className="flex-1 flex justify-center">
        {showSearch && <SearchController />}
      </div>
      {/* <div className="flex gap-5 items-center">
        <a
          href=""
          className="hover:bg-[--color-naranjo] hover:rounded-full p-2 text-[--color-naranjo] hover:text-white transition-colors"
        >
          <Profile className="w-6 h-6" />
        </a>
      </div> */}
    </nav>
  );
};

export default Navbar;

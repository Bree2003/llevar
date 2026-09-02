import { useNavigate } from "react-router";
//import { ReactComponent as Profile } from "components/Global/Icons/profile.svg";
import { useAppSelector } from "store/hooks/redux-hooks";
import SearchController from "controllers/Global/SearchController";
import { useLocation } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.UserPermissions);
  const location = useLocation();

  const showSearch = location.pathname.startsWith("/dashboard");

  return (
    <nav className="bg-[--color-grafito] flex justify-start items-center p-6">
      {/* Logo */}
      <a href="/" className="flex items-center">
        <img
          src="/images/logo-blanco.png"
          alt="Logo Concha y Toro"
          className="h-7"
        />
      </a>
      <div className="flex-1 flex justify-center">
        {showSearch && <SearchController />}
      </div>
      <div className="flex gap-5 items-center">
        <button
          type="button"
          onClick={() => navigate("/logout", { replace: true })}
          className="flex flex-col items-center gap-1 max-w-[6rem] p-2 text-[--color-naranjo] transition-colors hover:bg-[--color-naranjo] hover:rounded-full hover:text-white"
          title={`${user.name} ${user.surname}`}
        >
          {/* <Profile className="w-6 h-6 shrink-0" /> */}
          <span className="w-full truncate text-center text-xs">
            {`${user.name} ${user.surname}`}
          </span>
          <span className="w-full truncate text-center text-xs">(Logout)</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

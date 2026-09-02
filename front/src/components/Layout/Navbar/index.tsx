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
          title={`${user.name} ${user.surname}`}
          className="
    group

    flex
    items-center
    gap-3

    max-w-[220px]

    px-4
    py-2

    rounded-lg

    border
    border-white/20

    text-white

    hover:bg-white/10
    hover:border-[--color-accent]

    transition-all
    duration-200
  "
        >
          {/* USUARIO */}
          <div
            className="
      min-w-0

      flex
      flex-col

      text-left
      leading-tight
    "
          >

            <span
              className="
        text-xs

        text-white/60

        group-hover:text-[--color-accent]

        transition-colors
      "
            >
              Cerrar sesión
            </span>
          </div>

          {/* ICONO LOGOUT */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="
      w-5
      h-5

      flex-shrink-0

      text-[--color-accent]

      transition-transform
      duration-200

      group-hover:translate-x-0.5
    "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 17l5-5-5-5M15 12H3M15 5h3a3 3 0 013 3v8a3 3 0 01-3 3h-3"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

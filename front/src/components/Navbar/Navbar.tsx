// src/components/Navbar/Navbar.tsx
import { ReactComponent as Profile } from "components/Global/Icons/profile.svg";

// CAMBIO IMPORTANTE: Importamos el Controller, no el componente visual directo
import SearchController from "controllers/Global/SearchController";

const Navbar = () => {
  return (
    <nav className="bg-[--color-grafito] flex justify-start items-center p-8">
      {/* Logo */}
      <a href="/" className="flex items-center">
        <img
          src="/images/logo-blanco.png"
          alt="Logo Concha y Toro"
          className="h-8" // Ajustado ligeramente
        />
      </a>

      {/* Buscador Inteligente */}
      <div className="flex-1 flex justify-center">
        <SearchController />
      </div>

      {/* Perfil / Opciones */}
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

import { ReactComponent as Apps } from "components/Global/Icons/category.svg";
import { ReactComponent as Setting } from "components/Global/Icons/setting.svg";
import { ReactComponent as Profile } from "components/Global/Icons/profile.svg";
import SearchBar from "components/SearchBar/Searchbar";
const Navbar = () => {
  return (
    <nav className="bg-[--color-grafito] p-7 flex justify-between items-center">
      <a href="/">
      <img
        src="/images/logo-blanco.png"
        alt="Logo Concha y Toro"
        className="h-7"
      />
      </a>
      <SearchBar />
      <div className="flex gap-5 items-center">
        <a
          href=""
          className="hover:bg-[--color-naranjo] hover:rounded-full p-2 text-[--color-naranjo] hover:text-white"
        >
          <Apps />
        </a>
        <a
          href=""
          className="hover:bg-[--color-naranjo] hover:rounded-full p-2 text-[--color-naranjo] hover:text-white"
        >
          <Setting />
        </a>
        <a
          href=""
          className="hover:bg-[--color-naranjo] hover:rounded-full p-2 text-[--color-naranjo] hover:text-white"
        >
          <Profile />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

import { SearchSuggestion } from "models/Global/search-model";
import { ReactComponent as Search } from "components/Global/Icons/search-normal.svg";
import { ReactComponent as BucketIcon } from "components/Global/Icons/mantenimiento.svg";
import { ReactComponent as ProductIcon } from "components/Global/Icons/category.svg";

interface SearchBarProps {
  searchTerm: string;
  suggestions: SearchSuggestion[];
  loading: boolean;
  isFocused: boolean;
  onChange: (val: string) => void;
  onSelect: (item: SearchSuggestion) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
}

const SearchBar = ({
  searchTerm,
  suggestions,
  loading,
  isFocused,
  onChange,
  onSelect,
  onFocus,
  onBlur,
  onSubmit,
}: SearchBarProps) => {
  return (
    <div className="relative group z-50">
      <div className="flex gap-2 relative items-center">
        <Search
          className="absolute ml-3 text-[--color-gris-oscuro]"
          width={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Buscar Módulo o Producto..."
          className="rounded-lg w-[400px] pl-10 pr-4 py-2 border border-transparent focus:border-[--color-naranjo] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={onSubmit}
          className="bg-[--color-naranjo] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Buscar
        </button>
      </div>

      {isFocused && searchTerm.length > 0 && (
        <div className="absolute top-12 left-0 w-[400px] bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  onClick={() => onSelect(item)}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3"
                >
                  <div
                    className={`p-1.5 rounded-md ${
                      item.type === "module"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-orange-100 text-orange-500"
                    }`}
                  >
                    {item.type === "module" ? (
                      <BucketIcon width={16} />
                    ) : (
                      <ProductIcon width={16} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {item.type === "module"
                        ? "Módulo"
                        : item.subLabel || "Producto"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              {loading
                ? "Buscando en todos los módulos..."
                : "No se encontraron resultados."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

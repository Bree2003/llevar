import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getEnvironmentsService } from "services/Ingest/ingest-service";
import EnvironmentAdapter from "models/Ingest/environment-model";
import { getProductsService } from "services/Ingest/product-service";
import ProductAdapter from "models/Ingest/product-model";

import {
  SearchSuggestion,
  SapBucketsToSearchAdapter, // <--- Usamos el adaptador estricto
  ProductsToSearchAdapter,
} from "models/Global/search-model";

import SearchBar from "components/SearchBar/Searchbar";

const SearchController = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [allSuggestions, setAllSuggestions] = useState<SearchSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    loadGlobalSearchIndex();
  }, []);

  const loadGlobalSearchIndex = async () => {
    if (allSuggestions.length > 0) return;
    setLoading(true);

    try {
      const envResponse = await getEnvironmentsService();
      const envs = EnvironmentAdapter(envResponse);

      let globalIndex: SearchSuggestion[] = [];

      // --- 1. CARGAR MÓDULOS SAP ---
      // Usamos el adaptador que filtra y solo deja "Módulo XX"
      const sapSuggestions = SapBucketsToSearchAdapter(envs);
      globalIndex = [...sapSuggestions];

      // --- 2. CARGAR PRODUCTOS (Solo para entorno PD) ---
      // Identificamos el entorno de Productos de Datos
      const pdEnv = envs.find((e) => e.id === "pd"); // Asegúrate que el ID sea 'pd' en tu config

      if (pdEnv) {
        // Buscamos productos dentro de los buckets de PD
        const productPromises = pdEnv.buckets.map(async (bucket) => {
          try {
            const prodResponse = await getProductsService(pdEnv.id, bucket);
            const products = ProductAdapter(prodResponse);
            // Aquí no filtramos "manual" o "mts" dentro del producto,
            // pero sí formateamos el nombre bonito.
            return ProductsToSearchAdapter(products, pdEnv.id, bucket);
          } catch (err) {
            return [];
          }
        });

        const productResults = await Promise.all(productPromises);
        const allPdProducts = productResults.flat();

        globalIndex = [...globalIndex, ...allPdProducts];
      }

      setAllSuggestions(globalIndex);
    } catch (error) {
      console.error("Error cargando índice de búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTRADO (Igual que antes) ---
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = allSuggestions.filter((item) =>
        item.label.toLowerCase().includes(lowerTerm)
      );
      setFilteredSuggestions(filtered.slice(0, 10));
    }
  }, [searchTerm, allSuggestions]);

  const handleSearchChange = (val: string) => setSearchTerm(val);

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchTerm("");
    setIsFocused(false);
    const { envId, bucketName, productName } = suggestion.routeParams;

    if (suggestion.type === "module") {
      // Ir a lista de carpetas del Módulo SAP
      navigate(`/dashboard/${envId}/${bucketName}/manual/folders`);
    } else {
      // Ir a lista de carpetas del Producto PD
      navigate(`/dashboard/${envId}/${bucketName}/${productName}/folders`);
    }
  };

  const handleSubmit = () => {
    if (filteredSuggestions.length > 0)
      handleSelectSuggestion(filteredSuggestions[0]);
  };

  return (
    <SearchBar
      searchTerm={searchTerm}
      suggestions={filteredSuggestions}
      loading={loading}
      isFocused={isFocused}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      onChange={handleSearchChange}
      onSelect={handleSelectSuggestion}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchController;

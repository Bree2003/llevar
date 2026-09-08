import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ProductSidebarTable {
  id: string;
  label: string;
}

export interface ProductSidebarConfig {
  envId?: string;
  productName?: string;
  tables: ProductSidebarTable[];
  loading?: boolean;
  onSelectTable: (tableId: string) => void;
  onBack: () => void;
}

interface ProductSidebarContextValue {
  sidebar: ProductSidebarConfig | null;
  setSidebar: (config: ProductSidebarConfig) => void;
  clearSidebar: () => void;
}

const ProductSidebarContext = createContext<
  ProductSidebarContextValue | undefined
>(undefined);

interface ProductSidebarProviderProps {
  children: ReactNode;
}

export const ProductSidebarProvider = ({
  children,
}: ProductSidebarProviderProps) => {
  const [sidebar, setSidebarState] = useState<ProductSidebarConfig | null>(
    null,
  );

  const setSidebar = useCallback((config: ProductSidebarConfig) => {
    setSidebarState(config);
  }, []);

  const clearSidebar = useCallback(() => {
    setSidebarState(null);
  }, []);

  const value = useMemo(
    () => ({
      sidebar,
      setSidebar,
      clearSidebar,
    }),
    [sidebar, setSidebar, clearSidebar],
  );

  return (
    <ProductSidebarContext.Provider value={value}>
      {children}
    </ProductSidebarContext.Provider>
  );
};

export const useProductSidebar = () => {
  const context = useContext(ProductSidebarContext);

  if (!context) {
    throw new Error(
      "useProductSidebar debe usarse dentro de ProductSidebarProvider",
    );
  }

  return context;
};

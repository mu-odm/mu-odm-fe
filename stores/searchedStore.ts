import { Product } from "@/types/db-schema";
import { create } from "zustand";

interface ProductsSearchedStore {
    searchedProducts: Product[];
    addProducts: (newSearchedProducts: Product[]) => void;
    clearProducts: () => void;
  }
  
  const useProductsSearchedStore = create<ProductsSearchedStore>((set) => ({
    searchedProducts: [],
    addProducts: (newSearchedProducts) =>
      set((state) => ({
        searchedProducts: [...state.searchedProducts, ...newSearchedProducts],
      })),
    clearProducts: () => set({ searchedProducts: [] }),
  }));
  
  export default useProductsSearchedStore;
import { PurchaseProduct } from "@/types/db-schema";
import { create } from "zustand";

interface ClientPurchaseStore {
    clientPurchase: PurchaseProduct[];
    addClientPurchase: (newClientPurchase: PurchaseProduct) => void;
    clearClientPurchase: () => void;
  }
  
  const useClientPurchaseStore = create<ClientPurchaseStore>((set) => ({
    clientPurchase: [],
    addClientPurchase: (newClientPurchase) =>
      set((state) => ({
        clientPurchase: [...state.clientPurchase, newClientPurchase],
      })),
      clearClientPurchase: () => set({ clientPurchase: [] }),
  }));
  
  export default useClientPurchaseStore;
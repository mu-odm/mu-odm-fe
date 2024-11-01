"use client";
import React, { useEffect, useState } from "react";
import { useGetClients } from "@/api/user/useClient";
import { AddClient, PPS, ProductSize } from '@/types/db-schema';
import { Client } from '@/types/db-schema';
import { useGetUser } from "@/api/user/useUser";
import { useSession } from "next-auth/react";
import LoadingAnimation from "@/components/loading_animation"; // Assuming you have this component for loading state
import ClientSelectionModal from "@/components/clientselect";
import { useGetProducts } from "@/api/user/useProduct";
import { Product } from "@/types/db-schema";
import Modal from "@/components/modal";
import { FaShoppingCart } from "react-icons/fa";
import { useGetAllPPS } from "@/api/user/usePPS";
import { useGetProductSizeList } from "@/api/user/useProductSize";

interface PPSFullData extends PPS {
  product: Product;
  productSize: ProductSize;
}

export default function Home() {
  const session = useSession();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts();
  const { data: productSizes, isLoading: loadingSizes, error: sizeError } = useGetProductSizeList();
  const { data: clients, isLoading: isLoadingClients } = useGetClients();
  const { data: user, isLoading: isLoadingUser } = useGetUser(session.data?.user?.sub || "");
  const { data: pps, isLoading: loadingPPS, error: ppsError } = useGetAllPPS();

  const ppsFullData = pps?.map((pps: PPS) => ({
    ...pps,
    product: products?.find((product: Product) => product.id === pps.id.product_id),
    productSize: productSizes?.find((productSize: ProductSize) => productSize.id === pps.id.product_size_id),
  })) as PPSFullData[];
  
  const [purchaseList, setPurchaseList] = useState<{ product: Product; client: AddClient; amount: number , pps : ProductSize}[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedPPS, setSelectedPPS] = useState<PPSFullData | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [isPurchaseListModalOpen, setIsPurchaseListModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredClients =
    user && clients
      ? clients.filter((client) => client.user?.id === user.id)
      : [];

  const handleAddToPurchase = (pps: PPSFullData) => {
    setSelectedPPS(pps);
    setIsClientModalOpen(true);
  };

  const handleConfirmClient = (client: Client, amount: number) => {
    if (selectedPPS && amount > 0 && amount <= selectedPPS.remaining) {
      setPurchaseList((prev) => [
        ...prev, 
        { 
          product: selectedPPS.product, 
          pps: selectedPPS.productSize,
          client: { ...client, id: client.id || "default-id" }, // Assign a default if `id` is undefined
          amount 
        }
      ]);
      setSelectedPPS(null);
      setIsClientModalOpen(false);
      setAmount(0);
    } else {
      alert(`Please enter a valid amount (1 to ${selectedPPS?.remaining})`);
    }
  };
  
  
  const handleViewPurchaseList = () => {
    setIsPurchaseListModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };

  if (isLoadingProducts || isLoadingClients || isLoadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="w-full grid grid-cols-1 gap-3 px-16 text-black">

            <div className="flex justify-between">
              <div className="flex items-center font-bold">Product List</div>
              <div>
                <button
                  onClick={handleViewPurchaseList}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                  <FaShoppingCart className="mr-2" />
                  View Purchase List
                </button>
              </div>
            </div>
            {ppsFullData?.map((pps: PPSFullData, index: number) => (
              <div
                key={index}
                className="border p-5 flex justify-between items-center"
              >
                <span>{pps.product.name}</span>
                <div className="flex items-center space-x-5">
                <span>{pps.productSize.size}</span>
                  <span>Remaining:</span>
                  <span className="font-bold">{pps.remaining}</span>
                  <button
                    onClick={() => handleAddToPurchase(pps)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add to Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button to view the purchase list with a cart icon */}

      {/* Client selection modal */}
      <ClientSelectionModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onConfirm={handleConfirmClient}
        selectedPPS={selectedPPS}
        clients={filteredClients} // Pass the filtered clients
      />

      {/* Modal for viewing the purchase list */}
      <Modal
        isOpen={isPurchaseListModalOpen}
        onClose={() => setIsPurchaseListModalOpen(false)}
        purchaseList={purchaseList} // Pass the purchase list to the modal
      />

      {/* Error message display */}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}

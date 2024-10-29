"use client";
import React, { useEffect, useState } from "react";
import { useGetClients, UseClient } from "@/api/user/useClient";
import { useGetUser } from "@/api/user/useUser";
import { useSession } from "next-auth/react";
import LoadingAnimation from '@/components/loading_animation'; // Assuming you have this component for loading state
import ClientSelectionModal from '@/components/clientselect'; 
import { Product, useGetProducts } from "@/api/user/useProduct"; 
import Modal from '@/components/modal'; 
import { FaShoppingCart } from 'react-icons/fa';

export default function Home() {
  const session = useSession();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts();
  const { data: clients, isLoading: isLoadingClients } = useGetClients();
  const { data: user, isLoading: isLoadingUser } = useGetUser(session.data?.user?.sub || "");
  
  const [purchaseList, setPurchaseList] = useState<{ product: Product; client: UseClient; amount: number }[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [isPurchaseListModalOpen, setIsPurchaseListModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error handling

  // Filter clients based on the user ID
  const filteredClients = user && clients ? clients.filter(client => client.user.id === user.id) : [];

  const handleAddToPurchase = (product: Product) => {
    setSelectedProduct(product);
    setIsClientModalOpen(true);
  };

  const handleConfirmClient = (client: UseClient, amount: number) => {
    if (selectedProduct && amount > 0 && amount <= selectedProduct.remaining) {
      setPurchaseList((prev) => [...prev, { product: selectedProduct, client, amount }]);
      setSelectedProduct(null);
      setIsClientModalOpen(false);
      setAmount(0);
    } else {
      alert(`Please enter a valid amount (1 to ${selectedProduct?.remaining})`);
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
            {products?.map((product: Product, index: number) => (
              <div key={index} className="border p-5 flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex items-center space-x-5">
                  <span>Remaining:</span>
                  <span className="font-bold">{product.remaining}</span>
                  <button 
                    onClick={() => handleAddToPurchase(product)} 
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
      <div className="fixed bottom-10 right-10">
        <button 
          onClick={handleViewPurchaseList} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <FaShoppingCart className="mr-2" />
          View Purchase List
        </button>
      </div>

      {/* Client selection modal */}
      <ClientSelectionModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        onConfirm={handleConfirmClient} 
        selectedProduct={selectedProduct}
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

// components/ClientSelectionModal.tsx
import React, { useState } from 'react';
import { Client, PPS, ProductSize } from "@/types/db-schema";
import { Product } from '@/types/db-schema';
import { useCreatePurchaseProduct } from '@/api/user/usePurchaseProduct';
import useClientPurchaseStore from '@/stores/clientPurchaseStore';
import { useGetAllPPS } from '@/api/user/usePPS';

interface ClientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (client: Client, amount: number) => void; // Pass client and amount to parent
  selectedPPS: PPSFullData | null; // Selected product prop
  clients: Client[]; // Clients prop
}

interface PPSFullData extends PPS {
  product: Product;
  productSize: ProductSize;
}

const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedPPS,
  clients
}) => {

  const createPP = useCreatePurchaseProduct();
  const [amount, setAmount] = useState<number>(0);
  const addClientPurchase = useClientPurchaseStore((state) => state.addClientPurchase);
  const clientPurchase = useClientPurchaseStore((state) => state.clientPurchase);
  const { data: pps } = useGetAllPPS();

  if (!isOpen) return null;

  const handleConfirm = (client: Client) => {
    if (amount <= 0 || amount > (selectedPPS?.remaining || 0)) {
      alert(`Please enter a valid amount (1 to ${selectedPPS?.remaining})`); // Alert if the amount is invalid
      return;
    }

    if (!selectedPPS || !selectedPPS.product.id || !selectedPPS.productSize.id || !client.id) {
      console.error("Invalid product or product size");
      return;
    }

    try {

      if (clientPurchase.some((purchase) => 
        (purchase.id.pps_id.product_id === selectedPPS.product.id) && 
      (purchase.id.pps_id.product_size_id === selectedPPS.productSize.id) &&
      (
        purchase.clientID === client.id
      )
    )) {
        alert("Product already added");
        return
      }
      
      addClientPurchase({
        id: {
          purchase_id: "",
          pps_id: {
            product_id: selectedPPS.product.id,
            product_size_id: selectedPPS.productSize.id
          }
        },
        productID: selectedPPS.product.id,
        clientID: client.id,
        amount: amount
      });
    }
    catch (error) {
      console.error("Error adding purchase product:", error);
    }
    
    onConfirm(client, amount);
    setAmount(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Select a Client</h2>
        <ul className="space-y-2">
          {clients.map(client => (
            <li key={client.id} className="flex justify-between items-center">
              <span>{client.name}</span>
              <button
                onClick={() => handleConfirm(client)} // Confirm client selection
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <label className="block mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            max={selectedPPS?.remaining} // Set max based on remaining amount
            className="border rounded bg-white  p-2 w-full"
          />
        </div>
        <button
          onClick={onClose} // Close modal
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ClientSelectionModal;

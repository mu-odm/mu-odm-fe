// components/ClientSelectionModal.tsx
import React, { useState } from 'react';
import { UseClient } from '@/api/user/useClient';
import { Product } from '@/api/user/useProduct';

interface ClientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (client: UseClient, amount: number) => void; // Pass client and amount to parent
  selectedProduct: Product | null; // Selected product prop
  clients: UseClient[]; // Clients prop
}

const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedProduct,
  clients
}) => {
  const [amount, setAmount] = useState<number>(0); // State for amount input

  if (!isOpen) return null;

  const handleConfirm = (client: UseClient) => {
    if (amount <= 0 || amount > (selectedProduct?.remaining || 0)) {
      alert(`Please enter a valid amount (1 to ${selectedProduct?.remaining})`); // Alert if the amount is invalid
      return;
    }
    onConfirm(client, amount); // Pass selected client and amount to the parent component
    setAmount(0); // Reset the amount after confirmation
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
            max={selectedProduct?.remaining} // Set max based on remaining amount
            className="border rounded p-2 w-full"
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

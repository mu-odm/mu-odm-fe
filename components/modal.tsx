import React from 'react';
import { Product } from '@/types/db-schema'; // Adjust import based on your structure
import { Client } from "@/types/db-schema"; // Adjust import based on your structure

interface PurchaseItem {
  product: Product;
  client: Client; // Change to non-nullable type since we expect a valid client
  amount: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseList: PurchaseItem[]; // Define a type for purchase list
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, purchaseList }) => {
  if (!isOpen) return null; // Do not render the modal if it is not open

  // Group purchases by client
  const groupedPurchases = purchaseList.reduce<Record<string, { client: Client; products: { product: Product; amount: number }[] }>>(
    (acc, { product, client, amount }) => {
      const clientId = client.id; // Ensure client has an ID

      if (!acc[clientId]) {
        acc[clientId] = { client, products: [] };
      }
      acc[clientId].products.push({ product, amount });

      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Purchase List</h2>

        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Client</th>
              <th className="border-b px-4 py-2 text-left">Product</th>
              <th className="border-b px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedPurchases).length > 0 ? (
              Object.entries(groupedPurchases).flatMap(([clientId, { client, products }]) =>
                products.map(({ product, amount }, index) => (
                  <tr key={`${clientId}-${index}`} className="border-b">
                    {index === 0 && ( // Only show the client name on the first product row
                      <td rowSpan={products.length} className="px-4 py-2">
                        {client.name || 'N/A'}
                      </td>
                    )}
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{amount}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={3} className="text-center px-4 py-2">No items in the purchase list.</td>
              </tr>
            )}
          </tbody>
        </table>

        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

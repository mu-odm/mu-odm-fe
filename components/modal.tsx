import React from 'react';
import { Product } from '@/types/db-schema';
import { AddClient } from "@/types/db-schema";
import { useCreatePurchaseProduct } from '@/api/user/usePurchaseProduct';

interface PurchaseItem {
  product: Product;
  client: AddClient;
  amount: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseList: PurchaseItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, purchaseList }) => {
  const { mutateAsync: createPurchaseProduct } = useCreatePurchaseProduct();

  const handlePurchase = async () => {
    for (const { client, product, amount } of purchaseList) {
      await createPurchaseProduct({
        amount,
        clientID: client.id,
        productID: product.id,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Purchase List</h2>
        
        {/* Table to display purchase items */}
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Client</th>
              <th className="border-b px-4 py-2 text-left">Product</th>
              <th className="border-b px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchaseList.map(({ client, product, amount }, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{client.name || 'N/A'}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Submit Button */}
        <button 
          onClick={handlePurchase} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Confirm Purchase
        </button>
        
        {/* Close Button */}
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

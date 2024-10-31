import React from 'react';
import { Product } from '@/types/db-schema';
import { AddClient } from "@/types/db-schema";
import { useCreatePurchaseProduct } from '@/api/user/usePurchaseProduct';
import useClientPurchaseStore from '@/stores/clientPurchaseStore';
import { useGetClients } from '@/api/user/useClient';

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
  const createPP = useCreatePurchaseProduct();
  const clientPurchase = useClientPurchaseStore((state) => state.clientPurchase);
  const clearClientPurchase = useClientPurchaseStore((state) => state.clearClientPurchase);
  const { data: clients, isLoading: clientLoading } = useGetClients();

  const handlePurchase = async () => {
    clientPurchase.forEach(async (clientPurchase) => {
      const clientData = clients?.find((client) => client.id === clientPurchase.clientID);
      if (!clientData) return;
      if (clientData.deferStatus) return;

      await createPP.mutate({
        clientID: clientPurchase.clientID,
        product_id: clientPurchase?.id.pps_id.product_id,
        product_size_id: clientPurchase?.id.pps_id.product_size_id,
        amount: clientPurchase.amount
      });
    })
    onClose();
    await clearClientPurchase();
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

        <div className='flex flex-row w-full justify-between'>
          {/* Submit Button */}
        <div className='flex flex-row gap-2'>
        <button 
          onClick={handlePurchase} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Confirm Purchase
        </button>
        <button 
          onClick={() => {
            clearClientPurchase();
            onClose();
            window.location.reload();
          }} 
          className="mt-4 btn text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear
        </button>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
        
        </div>
      </div>
    </div>
  );
};

export default Modal;

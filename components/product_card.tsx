"use client";

import { useState } from 'react';
import { updateProductById, ApiProduct } from '@/api/user/useProduct'; // Ensure this import is correct
import { ProductManageForm } from './product_manage_form sm'; // Import your form

type CardProps = {
  id: string;
  title: string;
  price: number;
  status: string;
  amount: number;
};

export default function Card({ id, title, price, status, amount }: CardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedAmount, setEditedAmount] = useState(amount);

  const handleCardClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveChanges = async () => {
    const updatedData: Partial<ApiProduct> = {
      name: editedTitle,
      price: editedPrice,
      status: editedStatus,
      amount: editedAmount,
    };

    console.log("Attempting to update with data:", updatedData);
    
    const updatedProduct = await updateProductById(id, updatedData);

    if (updatedProduct) {
      setEditedTitle(updatedProduct.name);
      setEditedPrice(updatedProduct.price);
      setEditedStatus(updatedProduct.status);
      setEditedAmount(updatedProduct.amount);
      alert("Product updated successfully!");
    } else {
      alert("Failed to update product. Please try again.");
    }

    setIsModalVisible(false); 
  };

  return (
    <>
      {/* Main card UI */}
      <div 
        className="relative flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-500 cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:bg-red-600"
        onClick={handleCardClick}
      >
        <div className="px-4 py-2 flex flex-col h-full">
          <div className="font-bold text-sm mb-1 text-white truncate">{title}</div>
          <p className="text-white text-xs mb-1">Price: ${price}</p>
          <p className="text-white text-xs">Status: {status}</p>
          <p className="text-white text-xs">Remaining: {amount}</p>
        </div>
      </div>

      {/* Modal (pop-up) */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Product</h2>

            {/* Use ProductManageForm here */}
            <ProductManageForm 
              card_detail={{ 
                name: editedTitle,
                price: editedPrice,
                amount: editedAmount,
                status: editedStatus,
                size: [], // Replace this with actual size data if available
              }} 
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



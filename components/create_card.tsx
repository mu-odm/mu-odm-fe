"use client";

import { useState } from 'react';
import axios from 'axios';

type CardProps = {
  title: string; // Use for the product name
  description: string; // Use if needed
  imageUrl: string; // If needed
  warehouse: string; // If needed
  amount: number; // Can be used for price
};

const Modal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (name: string, amount: number, status: string) => void }) => {
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
        {/* Image placeholder */}
        <div className="w-full h-32 border border-gray-300 flex items-center justify-center mb-4">
          <span className="text-gray-500">[Product Image]</span>
        </div>
        
        {/* Editable Product Details */}
        <div className="text-left mb-4">
          <label className="block font-bold mb-1">Product Name:</label>
          <input 
            type="text" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter product name" 
          />

          <label className="block font-bold mb-1">Amount:</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))} 
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter amount" 
          />

          <label className="block font-bold mb-1">Status:</label>
          <input 
            type="text" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Enter status (H/M/L/O)" 
          />
        </div>

        {/* Cost Table */}
        <div className="border-t border-gray-300 pt-4">
          <h3 className="font-semibold mb-2">Production Source:</h3>
          <ul className="text-sm">
            <li>- Factory1 with cost: 570 baht/pack</li>
            <li>- Factory2 with cost: 527 baht/pack</li>
            <li>- Factory3 with cost: 600 baht/pack</li>
            <li>- Factory4 with cost: 584 baht/pack</li>
            <li>- Factory5 with cost: 522 baht/pack</li>
            <li>- Factory6 with cost: 500 baht/pack</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 bg-gray-300 rounded px-4 py-2">Close</button>
          <button 
            onClick={() => onConfirm(productName, amount, status)} 
            className="bg-green-500 text-white rounded px-4 py-2"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Create_Card({ title, description, imageUrl, warehouse, amount }: CardProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddProduct = async (name: string, amount: number, status: string) => {
    try {
      const response = await axios.post(
        'https://mu-odm-be.peerawitp.me/products',
        {
          name: name,
          price: amount,
          status: status,
          remaining: 30
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiU0FMRVNNQU4iLCJzdWIiOiJqZGFyQGdtYWlsLmNvbSIsImlhdCI6MTcyOTk0MTUyNywiZXhwIjoxNzMwMDI3OTI3fQ.sFQFTRuLE47T6f7E6eHgtE79k8xWI1Jxz_QcHzsOmV1sjTPEaS4mLCr5oDFaFjQn_EJFThlfMklc0_5ixuNvTQ"
          }
        }
      );
      console.log(response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <>
      <button 
        className="flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-400 cursor-pointer hover:shadow-xl transition-shadow duration-300"
        style={{ minHeight: "18rem", maxWidth: "12rem" }}
        onClick={() => setModalOpen(true)}
      >
        <div className="w-full h-44 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-3xl font-bold">+</span>
        </div>
        <div className="px-4 py-2 flex-grow flex flex-col items-center justify-center">
          <div className="font-bold text-sm mb-1 text-white text-center">{title}</div>
          <p className="text-white text-xs text-center">{description}</p>
        </div>
      </button>

      {/* Modal Component */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={(name, amount, status) => {
          handleAddProduct(name, amount, status);
          setModalOpen(false);
        }} 
      />
    </>
  );
}

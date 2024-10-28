"use client";

import React, { useState } from "react";
import { useAddProduct } from "@/api/user/useProduct";
import "@/app/globals.css"; // Assuming you have this CSS for the switch styling

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  warehouse: string;
  amount: number;
};

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, price: number, remaining: number, status: string) => void;
}) => {
  const [productName, setProductName] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
        <div className="text-left mb-4">
          <label className="block font-bold mb-1">Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter product name"
          />

          <label className="block font-bold mb-1">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter Price"
          />

          <label className="block font-bold mb-1">Remaining:</label>
          <input
            type="number"
            value={remaining}
            onChange={(e) => setRemaining(Number(e.target.value))}
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter remaining"
          />

          <label className="block font-bold mb-1">Status:</label>
          <div className="switch-container">
            <input
              type="checkbox"
              checked={status}
              onChange={() => setStatus(!status)}
              className="switch-input"
              id="statusSwitch"
            />
            <label className="switch-label" htmlFor="statusSwitch">
              <span className="switch-button"></span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 bg-gray-300 rounded px-4 py-2">
            Close
          </button>
          <button
            onClick={() => onConfirm(productName, price, remaining, status ? "available" : "unavailable")}
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
  const { mutate: addProduct } = useAddProduct();

  const handleAddProductWrapper = (name: string, price: number, remaining: number, status: string) => {
    if (!name || !price || !remaining || !status) {
      alert("Please fill out all fields.");
      return;
    }

    addProduct(
      { name, price, remaining, status },
      {
        onSuccess: (data) => {
          alert("Product added successfully!");
          setModalOpen(false);
        },
        onError: (error) => {
          console.error("Failed to add product:", error);
          alert("Failed to add product. Check console for details.");
        },
      }
    );
  };

  return (
    <>
      <button
        className="flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-400 cursor-pointer hover:shadow-xl transition-shadow duration-300 card"
        onClick={() => setModalOpen(true)}
      >
        <div className="w-full h-9 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-3xl font-bold">+</span>
        </div>
        <div className="px-4 py-2 flex-grow flex flex-col items-center justify-center">
          <div className="font-bold text-sm mb-1 text-white text-center">{title}</div>
        </div>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(name, price, remaining, status) => {
          handleAddProductWrapper(name, price, remaining, status);
        }}
      />
    </>
  );
}

'use client';

import React, { useState } from "react";
import { useAddProduct } from "@/api/user/useProduct";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import { usePostPPS } from "@/api/user/usePPS";
import "@/app/globals.css";
import { Status } from "@/types/db-schema";

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
  productSizes,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, price: number, remaining: number, status: Status, sizes: string[]) => void;
  productSizes: string[];
}) => {
  const [productName, setProductName] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

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
            className="w-full bg-white px-2 py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter product name"
          />

          <label className="block font-bold mb-1">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-2 bg-white py-1 border border-gray-300 rounded mb-2"
            placeholder="Enter Price"
          />

          <label className="block font-bold mb-1">Remaining:</label>
          <input
            type="number"
            value={remaining}
            onChange={(e) => setRemaining(Number(e.target.value))}
            className="w-full px-2 py-1 bg-white border border-gray-300 rounded mb-2"
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

          <label className="block font-bold mb-1">Size:</label>
          <div className="mb-2">
            {productSizes.map((sizeName, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${index}`}
                  checked={selectedSizes.includes(sizeName)}
                  onChange={() => handleSizeChange(sizeName)}
                  className="mr-2"
                />
                <label htmlFor={`size-${index}`} className="cursor-pointer">{sizeName}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 bg-gray-300 rounded px-4 py-2">
            Close
          </button>
          <button
            onClick={() => onConfirm(productName, price, remaining, status ? Status.Available : Status.Unavailable, selectedSizes)}
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
  const { mutate: postPPS } = usePostPPS();
  const { data: productSizes } = useGetProductSizeList();

  const handleAddProductWrapper = async (name: string, price: number, remaining: number, status: Status, sizes: string[]) => {
    if (!name || !price || !remaining || !status || sizes.length === 0) {
      alert("Please fill out all fields.");
      return;
    }

    addProduct(
      {
        name,
        price,
        remaining,
        status,
        size: ""
      },
      {
        onSuccess: async (productData) => {
          if (productData && productData.id) {
            alert("Product added successfully!");

            // Retrieve the product size IDs for selected sizes
            const sizeIds = sizes
              .map(size => {
                const matchingSize = productSizes?.find(ps => ps.size === size);
                return matchingSize ? matchingSize.id : null;
              })
              .filter(id => id !== null) as string[];

            // Post PPS for each valid product size ID
            sizeIds.forEach((sizeId) => {
              console.log("Posting PPS with:", { remaining, status });
              console.log("Posting PPS with:", { product_id: productData.id, product_size_id: sizeId });
              postPPS(
                { 
                  id: { product_id: productData.id, product_size_id: sizeId },
                  remaining: remaining,
                  status: status,
                 },
                {
                  onSuccess: () => console.log(`PPS entry added for size ID ${sizeId}`),
                  onError: (error) => {
                    console.error(`Failed to post PPS for size ID ${sizeId}:`, error);
                  },
                }
              );
            });

            alert("PPS process initiated.");
            setModalOpen(false);
          } else {
            alert("Product creation failed.");
          }
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
        onConfirm={(name, price, remaining, status, sizes) => {
          handleAddProductWrapper(name, price, remaining, status, sizes);
        }}
        productSizes={productSizes ? productSizes.map(size => size.size) : []}
      />
    </>
  );
}

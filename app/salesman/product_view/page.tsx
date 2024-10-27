"use client";

import { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';

interface Product {
  name: string;
  price: number;
  imageUrl: string;
  status: string;
  amount: number;
  page: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPaneVisible, setIsPaneVisible] = useState(false);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://mu-odm-be.peerawitp.me/products", {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiU0FMRVNNQU4iLCJzdWIiOiJqZGFyQGdtYWlsLmNvbSIsImlhdCI6MTczMDAyNDIzNCwiZXhwIjoxNzMwMTEwNjM0fQ.mdoSfOce1Mnv2y69WvcJxpZes-c0PN4rcAYBb8t1J3jIBK4O9hp5iAcY6v5qzN12yonNuX3I4F4PYH724Yp0wQ"
          }
        });

        // Assuming the response data is an array of productseyJhbGciOiJIUzUxMiJ9
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the fetch function when the component mounts
  }, []);

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPaneVisible(true);
  };

  const handleClosePane = () => {
    setIsPaneVisible(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product: Product, index: number) => (
              <div 
                key={index} 
                onClick={() => handleCardClick(product)} 
                className="flex flex-col items-center"
                style={{ cursor: 'pointer' }}
              >
                <Card
                  title={product.name}
                  price={product.price}
                  status={product.status}
                  amount={product.amount}
                />
              </div>
            ))}
            <div className="flex flex-col items-center" style={{ cursor: 'pointer' }}>
              <Create_Card
                title="Add New Product"
                description="Click to add a new product"
                imageUrl="" // Optional placeholder image
                warehouse=""
                amount={0}
              />
            </div>
          </div>
        </div>
      </div>

      {isPaneVisible && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/2">
            <div className="flex justify-center mb-4">
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">{selectedProduct.name}</h2>
            <p className="text-black">Price: {selectedProduct.price}</p>
            <p className="text-black">Status: {selectedProduct.status}</p>
            <p className="text-black">Amount: {selectedProduct.amount}</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleClosePane} className="bg-red-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

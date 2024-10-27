"use client";

import { useState, useEffect } from 'react'; // Import useState and useEffect
import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';
import fetchProduct, { ApiProduct } from "@/api/user/useProduct";

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
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProduct(); // Call your API function
        console.log("Fetched Products:", response);
        setProducts(response); // Set products state
      } catch (err) {
        setError("Error loading products"); // Handle errors
        console.error(err);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchData();
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

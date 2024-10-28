"use client";

import { useState, useEffect } from 'react';
import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';
import { Product, useGetProducts } from "@/api/user/useProduct";


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useGetProducts(); // Call your API function
        console.log("Fetched Products:", response);
      } catch (err) {
        setError("Error loading products"); // Handle errors
        console.error(err);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product: Product, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <Card
                  id= {product.id}
                  title={product.name}
                  price={product.price}
                  status={product.status}
                  amount={product.remaining}
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

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

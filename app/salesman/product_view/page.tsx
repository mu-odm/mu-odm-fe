"use client";

import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';
import { useGetProducts } from "@/api/user/useProduct";
import { Product } from '@/types/db-schema';
import LoadingAnimation from '@/components/loading_animation';

export default function Home() {
  // Use the useGetProducts hook for data fetching
  const { data: products, isLoading, error } = useGetProducts();

  if (isLoading) {
    return <LoadingAnimation/>
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Map through the products data if available */}
            {products?.map((product: Product) => (
              <div key={product.id} className="flex flex-col items-center">
                <Card
                  id={product.id}
                  title={product.name}
                  price={product.price}
                  status={product.status}
                  amount={product.remaining}
                />
              </div>
            ))}
            {/* Add New Product Card */}
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
      {error && <p className="text-red-500">Error loading products</p>}
    </div>
  );
}

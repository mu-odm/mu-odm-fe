"use client";

import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';
import { useGetProducts } from "@/api/user/useProduct";
import { PPS, Product, ProductSize } from '@/types/db-schema';
import LoadingAnimation from '@/components/loading_animation';
import { useGetProductSizeList } from '@/api/user/useProductSize';
import { useGetAllPPS } from '@/api/user/usePPS';

interface PPSFullData extends PPS {
  product: Product;
  productSize: ProductSize;
}

export default function Home() {
  // Use the useGetProducts hook for data fetching
  const { data: products, isLoading, error } = useGetProducts();
  const { data: productSizes, isLoading: loadingSizes, error: sizeError } = useGetProductSizeList();
  const { data: pps, isLoading: loadingPPS, error: ppsError, refetch: ppsRefetch } = useGetAllPPS();  

  if (isLoading || loadingSizes || loadingPPS) {
    return <LoadingAnimation/>
  }

  const ppsFullData = pps?.map((pps: PPS) => ({
    ...pps,
    product: products?.find((product: Product) => product.id === pps.id.product_id),
    productSize: productSizes?.find((productSize: ProductSize) => productSize.id === pps.id.product_size_id),
  })) as PPSFullData[];

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ppsFullData?.map((pps: PPSFullData) => {

              const uniqueKey = pps.id.product_id + pps.id.product_size_id;
              if (!pps.product || !pps.productSize || !pps.status) {
                return null;
              }

              return (
                <div key={uniqueKey} className="flex flex-col items-center">
                <Card
                  id={pps.id.product_id}
                  title={pps.product.name}
                  price={pps.product.price}
                  status={pps.status}
                  amount={pps.remaining}
                  size={pps.productSize.size}
                  sizeID={pps.id.product_size_id}
                />
              </div>
              )
            })}
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



"use client";
import { useRouter, useSearchParams } from 'next/navigation';

const ProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page'); // Get the slug from the URL using search params

  return (
    <div>
      <h1>Product: {page}</h1>
      {/* Add logic to fetch product data based on slug */}
      <button onClick={() => router.push('/')}>Go Back to Home</button>
    </div>
  );
};

export default ProductPage;


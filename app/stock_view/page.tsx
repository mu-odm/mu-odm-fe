// app/stock_view/page.tsx

"use client"; // Add this line

import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

// Define a Product interface
interface Product {
  name: string;
  warehouse: string;
  amount: number;
}

// Sample product data
const products: Product[] = [
  { name: 'Product 1', warehouse: 'Warehouse 1', amount: 10 },
  { name: 'Product 2', warehouse: 'Warehouse 1', amount: 20 },
  { name: 'Product 3', warehouse: 'Warehouse 2', amount: 30 },
  { name: 'Product 4', warehouse: 'Warehouse 2', amount: 40 },
  { name: 'Product 5', warehouse: 'Warehouse 3', amount: 50 },
  { name: 'Product 6', warehouse: 'Warehouse 3', amount: 60 },
  { name: 'Product 7', warehouse: 'Warehouse 1', amount: 70 },
  { name: 'Product 8', warehouse: 'Warehouse 2', amount: 80 },
  { name: 'Product 9', warehouse: 'Warehouse 3', amount: 90 },
  { name: 'Product 10', warehouse: 'Warehouse 1', amount: 100 },
];

export default function StockView() {
  // Use the Product type in useState
  const [productData, setProductData] = useState<Product[]>(products); // Initialize with typed products

  useEffect(() => {
    // Simulating an API call to fetch data if needed
    // Uncomment and replace with your API call as necessary
    /*
    const fetchData = async () => {
      // fetch data logic
      setProductData(fetchedData);
    };
    fetchData();
    */
  }, []);

  return (
    <div className="flex-1 bg-white">
      <Header title="Stock View" button1Text="Profile" button2Text="Settings" />
      <div className="p-8">
        <div className="flex">
          <Sidebar />
          <div className="w-full grid grid-cols-1 gap-3 px-16 text-black">
            {productData.map((product, index) => (
              <div key={index} className="border p-5 flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex items-center space-x-5">
                  <span>Amount in</span>
                  <select className="border px-3 py-1 bg-red-500 text-white">
                    <option>{product.warehouse}</option>
                    <option>Warehouse 2</option>
                    <option>Warehouse 3</option>
                  </select>
                  <span>{product.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

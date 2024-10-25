"use client"; // Ensure this is a client component

import { useState } from 'react'; // Import useState
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Card from '@/components/product_card';
import Create_Card from '@/components/create_card';

// Define a Product interface
interface Product {
  name: string;
  description: string;
  imageUrl: string;
  warehouse: string;
  amount: number;
  page: string;
}

const products: Product[] = [
  {
    name: 'See you again',
    description: 'Tyler the Creator',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738940ac99f49e44f59e6f7fb3',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'product',
  },
  {
    name: 'After Hour',
    description: 'The Weeknd',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Intentions',
    description: 'Starfall',
    imageUrl: 'https://i1.sndcdn.com/artworks-3rJ8cDksWZz5-0-t500x500.jpg',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Limbo',
    description: 'Keshi',
    imageUrl: 'https://melody-assets.line-scdn.net/musics/public/1a9fc3bd-35b2-4457-b460-f675962a168d.jpeg',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Demons',
    description: 'Joji',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2733a927e16c14f2aeb7c004e19',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Moonlight',
    description: 'Kali Uchis',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b27381fccd758776d16b87721b17',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Die with a smile',
    description: 'Bruno & Gaga',
    imageUrl: 'https://www.dochord.com/wp-content/uploads/2024/08/Lady-Gaga-Bruno-Mars-Die-With-A-Smile.webp',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
  {
    name: 'Dark Red',
    description: 'Steve Lacy',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2733d2dfa42f771cd458b194979',
    warehouse: 'Warehouse1',
    amount: 50,
    page: 'seeyouagain',
  },
];

export default function Home() {
  // State to manage the selected product and pane visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPaneVisible, setIsPaneVisible] = useState(false);

  // Define the handleCardClick function with an explicit type for product
  const handleCardClick = (product: Product) => {
    setSelectedProduct(product); // Set the selected product
    setIsPaneVisible(true); // Show the pane
  };

  const handleClosePane = () => {
    setIsPaneVisible(false); // Hide the pane
    setSelectedProduct(null); // Clear the selected product
  };

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex">
          <div className="h-96 grid grid-cols-4 gap-x-4 gap-y-1 px-20 text-black">
            {products.map((product: Product, index: number) => (  // Explicitly define the type for product
              <div key={index} onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
                <Card
                  title={product.name}
                  description={product.description}
                  imageUrl={product.imageUrl}
                  warehouse={product.warehouse}
                  amount={product.amount}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Pane */}
{isPaneVisible && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
    <div className="bg-white p-8 rounded shadow-lg w-1/2">
      {/* Centered Image */}
      <div className="flex justify-center mb-4">
        <img
          src={selectedProduct.imageUrl}
          alt={selectedProduct.name}
          className="h-auto w-1/2 rounded" // Set width to 50% of the container
        />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-black">{selectedProduct.name}</h2>
      <p className="text-black">Description: {selectedProduct.description}</p>
      <p className="text-black">Warehouse: {selectedProduct.warehouse}</p>
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

"use client";
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Card from '@/components/product_card';

const products = [
  {
    name: 'See you again',
    description: 'Tyler the Creator',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738940ac99f49e44f59e6f7fb3',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  },
  {
    name: 'After Hour',
    description: 'The Weeknd',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  },
  {
    name: 'Intentions',
    description: 'Starfall',
    imageUrl: 'https://i1.sndcdn.com/artworks-3rJ8cDksWZz5-0-t500x500.jpg',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  }
  ,
  {
    name: 'Limbo',
    description: 'Keshi',
    imageUrl: 'https://melody-assets.line-scdn.net/musics/public/1a9fc3bd-35b2-4457-b460-f675962a168d.jpeg',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  },
  {
    name: 'Demons',
    description: 'Joji',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2733a927e16c14f2aeb7c004e19',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  },
  {
    name: 'Moonlight',
    description: 'Kali Uchis',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b27381fccd758776d16b87721b17',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  },
  {
    name: 'Die with a smile',
    description: 'Bruno & Gaga',
    imageUrl: 'https://www.dochord.com/wp-content/uploads/2024/08/Lady-Gaga-Bruno-Mars-Die-With-A-Smile.webp',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  }
  ,
  {
    name: 'Dark Red',
    description: 'Steve lacy',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2733d2dfa42f771cd458b194979',
    warehouse: 'Warehouse1',
    amount: 50,
    page : 'seeyouagain'
  }
];

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Header title="Product Views" button1Text="Profile" button2Text="Settings" />
      <div className="p-8">
        <div className="flex">
          <Sidebar />
          <div className="h-96 grid grid-cols-4 gap-x-4 gap-y-1 px-20 text-black">
            {products.map((product, index) => (
              <Card
                key={index}
                title={product.name}
                description={product.description}
                imageUrl={product.imageUrl}
                warehouse={product.warehouse}
                amount={product.amount}
                slug = {product.page}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// pages/index.tsx or app/page.tsx
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

const products = Array(10).fill({
  name: 'Product: name',
  warehouse: 'Warehouse1',
  amount: 'num',
});

export default function Home() {
  return (
      <div className="flex-1 bg-white">
        <Header title="Stock Views" button1Text="Profile" button2Text="Settings" />
        <div className="p-8">
         <div className = "flex">
          <Sidebar />
          <div className="w-full grid grid-cols-1 gap-3 px-16 text-black">
            {products.map((product, index) => (
              <div key={index} className="border p-5 flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex items-center space-x-5">
                  <span>Amount in</span>
                  <select className="border px-3 py-1 bg-red-500 text-white">
                    <option>{product.warehouse}</option>
                    <option>Warehouse2</option>
                    <option>Warehouse3</option>
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

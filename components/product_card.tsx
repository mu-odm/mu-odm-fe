"use client";
import { useRouter } from 'next/navigation';

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  warehouse: string;
  amount: number;
  slug: string;
};

export default function Card({ title, description, imageUrl, warehouse, amount, slug }: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product_view/${slug}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col-1 h-44 w-auto rounded overflow-hidden shadow-lg bg-red-600 cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <img className="w-44 h-44 object-fit" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-white whitespace-nowrap overflow-auto ">{title}</div>
        <p className="text-white text-base">{description}</p>
        <p className="text-white">Warehouse: {warehouse}</p>
        <p className="text-white">Amount: {amount}</p>
      </div>
    </div>
  );
}

  
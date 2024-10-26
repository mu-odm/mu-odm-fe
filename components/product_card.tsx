"use client";

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  warehouse: string;
  amount: number;
};

export default function Card({ title, description, imageUrl, warehouse, amount }: CardProps) {
  return (
    <div 
      className="flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-500 cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-48 aspect-w-4 aspect-h-3">
        <img className="w-full h-full object-cover" src={imageUrl} alt={title} />
      </div>
      <div className="px-4 py-2 flex flex-col h-full"> {/* Ensure vertical layout */}
        <div className="font-bold text-sm mb-1 text-white truncate">{title}</div>
        <p className="text-white text-xs mb-1 line-clamp-2">{description}</p>
        <p className="text-white text-xs">Warehouse: {warehouse}</p>
        <p className="text-white text-xs">Amount: {amount}</p>
      </div>
    </div>
  );
}

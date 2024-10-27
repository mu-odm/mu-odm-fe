"use client";

type CardProps = {
  title: string;
  price: number;
  status: string;
  amount: number;
};

export default function Card({ title, price, status, amount }: CardProps) {
  return (
    <div 
      className="flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-500 cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <div className="px-4 py-2 flex flex-col h-full"> {/* Ensure vertical layout */}
        <div className="font-bold text-sm mb-1 text-white truncate">{title}</div>
        <p className="text-white text-xs mb-1 line-clamp-2">{price}</p>
        <p className="text-white text-xs">status: {status}</p>
        <p className="text-white text-xs">remaining: {amount}</p>
      </div>
    </div>
  );
}

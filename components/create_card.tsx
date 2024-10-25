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
      className="flex flex-col-1 h-44 w-auto rounded overflow-hidden shadow-lg bg-red-500 cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <img className="w-44 h-44 object-fit" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-white whitespace-nowrap overflow-auto ">+</div>
      </div>
    </div>
  );
}

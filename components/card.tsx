'use client';

import { useRouter } from 'next/navigation';

export default function Card({ card_detail }: any) {

    const router = useRouter();

    const routeHandler = (route: string, id: string) => {
        router.push(route + "/" + id);
    }

    return (
        <div className="card card-compact bg-base-100 w-1/4 shadow-xl hover:cursor-pointer flex"
            onClick={() => routeHandler(card_detail.route, card_detail.id)}
        >
            <div className="card-body">
                <div className='flex flex-row justify-between items-center'>
                    <div className="card-title">{card_detail.name}</div>
                    <div className='text-md font-bold'>({card_detail.amount})</div>
                </div>
                <p>size: {card_detail.size}</p>
                <p>price: {card_detail.price}</p>
                <p>status: {card_detail.status}</p>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
    )
}
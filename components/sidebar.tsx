"use client";

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface Route {
    name: string;
    route: string;
}

interface SidebarProps {
    route_list?: Route[];  // `route_list` is optional
}

export default function Sidebar({ route_list = [] }: SidebarProps) { // Default to empty array
    const router = useRouter();

    const routeHandler = (route: string) => {
        router.push(route);
    };

    const logoutHandler = () => {
      useAuthStore.getState().clearToken();
      window.location.reload();
    }

    return (
        <div className="flex flex-col gap-5 w-fit h-fit">
            {route_list.map((route, index) => (
                <div
                    key={index}
                    onClick={() => routeHandler(route.route)}
                    className="cursor-pointer w-40 btn bg-red-500 text-white"
                >
                    {route.name}
                </div>
            ))}
            <div className='btn' onClick={logoutHandler}>Logout</div>
        </div>
    );
}

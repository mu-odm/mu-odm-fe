'use client';

import { useRouter } from 'next/navigation';

const useRouteHandler = () => {
    const router = useRouter();

    const navigateToRoute = (route: string, id: string) => {
        router.push(`${route}/${id}`);
    };

    return navigateToRoute;
};

export default useRouteHandler;

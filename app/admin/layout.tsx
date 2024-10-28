import Sidebar from "@/components/sidebar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  
    const route_list = [
        {
            name: "All Orders",
            route: "/admin/all_orders"
        },
        {
            name: "Manage Product",
            route: "/admin/manage_product"
        },

    ];
  
    return (
        <div className="flex-col h-fit bg-white p-10">
            <div className="bg-red-500 h-fit p-6 flex gap-5 justify-between rounded-md mb-10">
                <div className="text-6xl text-white">Admin</div>
                <div className="gap-5 flex">
                    <div className="btn">Personal Information</div>
                    <div className="btn">Setting</div>
                </div>
            </div>
            <div className="flex flex-row h-full">
                <div className="mr-10"><Sidebar route_list={route_list} /></div>
                <div className=" border-black w-full min-h-[40rem] h-fit p-5 border rounded-md">
                    {children}
                </div>
            </div>
        </div>
  );
}
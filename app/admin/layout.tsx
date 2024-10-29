import { MenuBar } from "@/components/menu_bar";
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
        {
            name: "Manage Size",
            route: "/admin/manage_size"
        },

    ];
  
    return (
        <div className="w-full">
            <div className="border shadow-md flex flex-row items-center justify-between bg-red-500 h-[6rem]">
                <MenuBar title_name={"Admin"} route_list={route_list} />
                <div className="btn m-2 mx-4">Logout</div>
            </div>

            <div className="flex-col h-fit bg-white p-10 px-[15rem]">
            
            <div className="flex flex-row h-full">
                <div className="w-full min-h-screen h-fit p-10 shadow-lg rounded-md justify-center">
                    {children}
                </div>
            </div>
        </div>
        </div>
  );
}
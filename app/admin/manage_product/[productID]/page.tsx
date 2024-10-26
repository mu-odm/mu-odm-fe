import { ProductManageForm } from "@/components/product_manage_form";
import { StatusDropdown } from "@/components/status_dropdown";
import { Button } from "@/components/ui/button";

interface ProductProps {
    params: {
        productID: string;
    };
}

export default function Product({ params }: ProductProps) {
    const { productID } = params;

    const card_detail = {
        id: 1,
        name: "Shoes",
        amount: 10,
        price: 100,
        status: "available",
        size: [
            { id: 1, name: "xl", additional_price: 10 },
            { id: 2, name: "l", additional_price: 5 },
            { id: 3, name: "m", additional_price: 2 },
            { id: 4, name: "s", additional_price: 0 },
        ],
        route: "/admin/manage_product"
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-row gap-5 text-lg text-black font-bold my-5 w-3/5 justify-between">
                <div>Product ID: {card_detail.id}</div>
     
            </div>
            <div className="w-3/5">
                <ProductManageForm card_detail={card_detail} />
            </div>
        </div>
    );
}

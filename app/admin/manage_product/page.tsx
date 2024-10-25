import Card from "@/components/card";

export default function ManageProduct() {

    const card_detail = {
        id: 1,
        name: "Shoes",
        size: "xl",
        price: 100,
        amount: 10,
        status: "active",
        route: "/admin/manage_product"
    }

    return (
        <div className="flex flex-row flex-wrap gap-10 justify-between">
            {
                Array(10).fill(0).map((_, index) => (
                    <Card card_detail={card_detail} key={index} />
                ))
            }
        </div>
    )
}
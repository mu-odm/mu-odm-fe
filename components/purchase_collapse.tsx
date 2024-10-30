"use client";

import { useGetClients } from "@/api/user/useClient";
import { useGetOrder } from "@/api/user/useOrder";
import { useGetProducts, useUpdateProduct } from "@/api/user/useProduct";
import { usePurchase, useUpdatePurchase } from "@/api/user/usePurchase";
import { usePurchaseProduct } from "@/api/user/usePurchaseProduct";
import useRouteHandler from "@/lib/routeHandler";
import LoadingAnimation from "./loading_animation";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PPS, Product, Purchase, PurchaseApproval, PurchaseProduct } from "@/types/db-schema";
import { useGetAllPPSBYProductID } from "@/api/user/usePPS";
import { useGetProductSizeList } from "@/api/user/useProductSize";

interface PurchaseCollapseProps {
    purchase: Purchase;
}

const PurchaseCollapse: React.FC<PurchaseCollapseProps> = ({ purchase }) => {
    const { data: purchases, isLoading: purchaseLoading, refetch: purchaseRefetch } = usePurchase();
    const { data: clients, isLoading: clientLoading } = useGetClients();
    const { data: products, isLoading: productLoading, refetch: productsRefetch } = useGetProducts();
    const { data: purchase_products, isLoading: purchaseProductLoading } = usePurchaseProduct();
    const { data: orders, isLoading: orderLoading } = useGetOrder();
    const { data: sizes, isLoading: sizeLoading } = useGetProductSizeList();

    const [selectedProductID, setSelectedProductID] = useState<string>("");
    const { data: ppsByProductID, isLoading: ppsLoading } = useGetAllPPSBYProductID(selectedProductID);

    const updatePurchase = useUpdatePurchase();
    const updateProduct = useUpdateProduct();
    const navigateToRoute = useRouteHandler();

    const isLoading = ppsLoading || purchaseLoading || clientLoading || productLoading || purchaseProductLoading || orderLoading || sizeLoading;
    
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState<PurchaseApproval | undefined>();


    useEffect(() => {
        if (purchaseLoading || productLoading || purchaseProductLoading) return;
        if (!purchases || !products || !purchase_products) return;

        const purchaseData = purchases.find((p: Purchase) => p.id === purchase.id);
        if (!purchaseData) return;

        const allProductsInPurchase = purchase_products.filter((pp: PurchaseProduct) => pp.id.purchase_id === purchase.id);
        let totalAmount = 0;

        allProductsInPurchase.forEach((pp: PurchaseProduct) => {
            const productData = products.find((p: Product) => p.id === pp.productID);
            totalAmount += (productData?.price ?? 0) * pp.amount;
        });

        setTotal(totalAmount);
        setStatus(purchaseData.status);
    }, [purchase.id, purchases, products, purchase_products, purchaseLoading, productLoading, purchaseProductLoading]);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    const purchaseData = purchases?.find((p: Purchase) => p.id === purchase.id);
    const allPurchaseProductsInPurchase = purchase_products?.filter((pp) => pp.id.purchase_id === purchase.id);

    const allProductsInPP = products?.filter((p) => allPurchaseProductsInPurchase?.some((pp) => pp.id.pps_id.product_id === p.id));
    const allSizesInPP = sizes?.filter((s) => allPurchaseProductsInPurchase?.some((pp) => pp.id.pps_id.product_size_id === s.id));

    const clientData = clients?.find((c) => c.id === purchaseData?.clientID);
    const orderData = orders?.find((o) => o.id === purchaseData?.orderID);

    const saveHandler = async () => {
        try {
            if (!status || !purchaseData) return;

            const shouldDecrement = 
                (purchaseData.status === PurchaseApproval.Rejected || purchaseData.status === PurchaseApproval.Pending) &&
                status === PurchaseApproval.Approved;
            const shouldIncrement = 
                purchaseData.status === PurchaseApproval.Approved &&
                (status === PurchaseApproval.Rejected || status === PurchaseApproval.Pending);

            await updatePurchase.mutateAsync({
                purchaseID: purchase.id,
                status: status,
            });

            if (products && allPurchaseProductsInPurchase) {
                await Promise.all(products.map(async (product: Product) => {
                    const purchaseProduct = allPurchaseProductsInPurchase.find((pp) => pp.productID === product.id);
                    if (purchaseProduct) {
                        let newRemaining = product.remaining;
                        if (shouldIncrement) newRemaining += purchaseProduct.amount;
                        if (shouldDecrement) newRemaining -= purchaseProduct.amount;

                        await updateProduct.mutateAsync({
                            id: product.id,
                            product: {
                                ...product,
                                remaining: newRemaining,
                            },
                        });
                    }
                }));
            }

            await productsRefetch();
            await purchaseRefetch();
        } catch (error) {
            console.error(error);
        }
    };

    const statusColor = () => {
        if (status === PurchaseApproval.Approved) return "text-green-500";
        if (status === PurchaseApproval.Rejected) return "text-red-500";
        return "text-yellow-500";
    };

    return (
        <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Purchase ID: {purchaseData?.id}</div>
            
            <div className="collapse-content flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                    
                    <p>Created At: {purchaseData?.created_at}</p>

                </div>
                <hr className="border-t border-gray-300 w-full my-2" />
                <div>
                    <div className="text-lg font-bold">Client</div>
                    <p>ID: {purchaseData?.clientID}</p>
                    <p>Email: {clientData?.email}</p>
                    <p>Name: {clientData?.name}</p>
                    <p>Contract Year: {clientData?.contract_year}</p>
                    <p>Contact: {clientData?.contact}</p>
                    <p>Location: {clientData?.location}</p>
                </div>
                <div>
                    <div className="text-lg font-bold">Supervisor</div>
                    <p>Email: {orderData?.user.email}</p>
                    <p>Username: {orderData?.user.username}</p>
                    <p>Role: {orderData?.user.role}</p>
                    <p>Region: {orderData?.user.region}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-lg font-bold">Total:</div>
                        <p><span className="text-green-500">{total}</span> THB.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {allPurchaseProductsInPurchase?.map((pp) => {
                            const productData = allProductsInPP?.find((p) => p.id === pp.productID);
                            const sizeData = allSizesInPP?.find((s) => s.id === pp.id.pps_id.product_size_id);
                            const ppsData = ppsByProductID?.find((pps) => pps.product_id === pp.id.pps_id.product_id);
                            const uniqueKey = pp.id.pps_id.product_id + pp.id.pps_id.product_size_id;
                            return (
                                <div key={uniqueKey} className="flex flex-col gap-2">
                                    <div className="text-lg font-bold">{productData?.id}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <p>Amount: {pp.id.pps_id.product_id}</p>
                                        <p>Price: {productData?.price} THB.</p>
                                        <p>Size: {sizeData?.size}</p>
                                        <p>Additional Price: {sizeData?.additional_price} THB.</p>
=                                    </div>
                                </div>
                            );
                        })
                        }
                    </div>
                    {

                            // allPurchaseProductsInPurchase?.map((pp: PurchaseProduct) => {
                            //     const ppsData = ppsByProductID?.find((pps: PPS) => pps.product_id === pp.id.pps_id.product_id 
                            //         && pps.product_size_id === pp.id.pps_id.product_size_id);
                            //     console.log(pp)
                            //     const productData = products?.find((p: Product) => p.id === ppsData?.product_id);
                            //     const sizeData = sizes?.find((s: any) => s.id === ppsData?.product_size_id);
                            //     const uniqueKey = `${pp.id.purchase_id}-${pp.id.pps_id.product_id}-${pp.id.pps_id.product_size_id}`;
                            //     console.log(ppsData);
                            //     return (
                            //         <div key={uniqueKey} className="flex flex-col border rounded-md p-3 hover:bg-gray-600 hover:cursor-pointer" onClick={() => navigateToRoute(
                            //             `/admin/manage_product`,
                            //             pp.id.pps_id.product_id
                            //         )}>
                            //             <div className="flex flex-row justify-between items-center">
                            //                 <div className="text-lg font-bold">Product</div>
                            //                 <div className="text-blue-500">(x{pp.amount})</div>
                            //             </div>
                            //             <p>ID: {ppsData?.product_id}</p>
                            //             <p>Name: {productData?.name}</p>
                            //             <p>Price: {productData?.price} + {sizeData?.additional_price}</p>
                            //             <p>Quantity: {productData?.remaining}</p>
                            //             <p>Status: {productData?.status}</p>
                            //             <p>Size: {sizeData?.size}</p>
                            //         </div>
                            //     );
                            // })
                        // }
                    }
                </div>
                <hr className="border-t border-gray-300 w-full my-2" />
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-bold">Status</div>
                    <div className={`${statusColor()}`}>
                        <Select
                            value={status}
                            onValueChange={(value: PurchaseApproval) => setStatus(value)}
                        >
                            <SelectTrigger id="status" className="h-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent position="popper" onClick={(event) => event.stopPropagation()}>
                                <SelectItem value={PurchaseApproval.Approved}>Approved</SelectItem>
                                <SelectItem value={PurchaseApproval.Rejected}>Rejected</SelectItem>
                                <SelectItem value={PurchaseApproval.Pending}>Pending</SelectItem>
                            </SelectContent>
                        </Select>    
                    </div>
                    <div className="btn btn-success" onClick={() => saveHandler()}>Save</div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCollapse;

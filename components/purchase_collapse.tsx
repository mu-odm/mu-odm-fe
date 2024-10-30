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
import { useGetAllPPS, useGetAllPPSBYProductID, useUpdatePPSByPPSID } from "@/api/user/usePPS";
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
    const { data: pps, isLoading: ppsLoading, refetch: ppsRefetch } = useGetAllPPS();

    const updatePurchase = useUpdatePurchase();
    const updatePPS = useUpdatePPSByPPSID();
    const navigateToRoute = useRouteHandler();

    const isLoading = ppsLoading || purchaseLoading || clientLoading || productLoading || purchaseProductLoading || orderLoading || sizeLoading;
    
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState<PurchaseApproval | undefined>();


    useEffect(() => {
        if (purchaseLoading || productLoading || purchaseProductLoading) return;
        if (!purchases || !products || !purchase_products || !sizes || !pps) return;
    
        const purchaseData = purchases.find((p: Purchase) => p.id === purchase.id);
        if (!purchaseData) return;
    
        // Define purchase-related variables within the useEffect scope
        const allPurchaseProductsInPurchase = purchase_products.filter((pp) => pp.id.purchase_id === purchase.id);
        const allPPSInPP = pps.filter((pps) =>
            allPurchaseProductsInPurchase.some((pp) => pp.id.pps_id.product_id === pps.id.product_id && pp.id.pps_id.product_size_id === pps.id.product_size_id)
        );
        const allProductsInPP = products.filter((p) =>
            allPurchaseProductsInPurchase.some((pp) => pp.id.pps_id.product_id === p.id)
        );
        const allSizesInPP = sizes.filter((s) =>
            allPurchaseProductsInPurchase.some((pp) => pp.id.pps_id.product_size_id === s.id)
        );
    
        let totalAmount = 0;
        allPurchaseProductsInPurchase.forEach((pp: PurchaseProduct) => {
            const productData = allProductsInPP.find((p) => p.id === pp.id.pps_id.product_id);
            const sizeData = allSizesInPP.find((s) => s.id === pp.id.pps_id.product_size_id);
    
            if (productData && sizeData) {
                totalAmount += (productData.price + sizeData.additional_price) * pp.amount;
            }
        });
    
        setTotal(totalAmount);
        setStatus(purchaseData.status);
    }, [purchase.id, purchases, products, purchase_products, sizes, pps, purchaseLoading, productLoading, purchaseProductLoading]);
    

    if (isLoading) {
        return <LoadingAnimation />;
    }

    const purchaseData = purchases?.find((p: Purchase) => p.id === purchase.id);
    const allPurchaseProductsInPurchase = purchase_products?.filter((pp) => pp.id.purchase_id === purchase.id);
    const allPPSInPP = pps?.filter((pps) => allPurchaseProductsInPurchase?.filter((pp) => pp.id.pps_id.product_id === pps.id.product_id && pp.id.pps_id.product_size_id === pps.id.product_size_id));
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

            if (purchaseData && allPurchaseProductsInPurchase && allPPSInPP) {
                await Promise.all( allPurchaseProductsInPurchase.map(async (pp: PurchaseProduct) => {
                    const ppsData = allPPSInPP.find((pps: PPS) => pps.id.product_id === pp.id.pps_id.product_id && pps.id.product_size_id === pp.id.pps_id.product_size_id);
                    if (ppsData) {
                        if (shouldDecrement) {
                            await updatePPS.mutateAsync({
                                id: {
                                    product_id: pp.id.pps_id.product_id,
                                    product_size_id: pp.id.pps_id.product_size_id,
                                },
                                remaining: ppsData.remaining - pp.amount,
                                status: ppsData.status
                            });
                        } else if (shouldIncrement) {
                            await updatePPS.mutateAsync({
                                id: {
                                    product_id: pp.id.pps_id.product_id,
                                    product_size_id: pp.id.pps_id.product_size_id,
                                },
                                remaining: ppsData.remaining + pp.amount,
                                status: ppsData.status
                            });
                        }
                    }
                }))
            }
            
            await ppsRefetch();
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
                    {allPurchaseProductsInPurchase?.map((pp: PurchaseProduct) => {
                            const productData = allProductsInPP?.find((p) => p.id === pp.id.pps_id.product_id);
                            const sizeData = allSizesInPP?.find((s) => s.id === pp.id.pps_id.product_size_id);
                            const ppsData = allPPSInPP?.find((pps: any) => pps.id.product_id === pp.id.pps_id.product_id && pps.id.product_size_id === pp.id.pps_id.product_size_id);
                            const uniqueKey = pp.id.pps_id.product_id + pp.id.pps_id.product_size_id;
                            
                                return (
                                    <div key={uniqueKey} className="flex flex-col border rounded-md p-3 hover:bg-gray-600 hover:cursor-pointer" onClick={() => navigateToRoute(
                                        `/admin/manage_product`,
                                        pp.id.pps_id.product_id
                                    )}>
                                        <div className="flex flex-row justify-between items-center">
                                            <div className="text-lg font-bold">Product</div>
                                            <div className="text-blue-500">(x{pp.amount})</div>
                                        </div>
                                        <p>ID: {productData?.id}</p>
                                        <p>Name: {productData?.name}</p>
                                        <p>Price: {productData?.price} + {sizeData?.additional_price}</p>
                                        <p>Quantity: {ppsData?.remaining}</p>
                                        <p>Status: {ppsData?.status}</p>
                                        <p>Size: {sizeData?.size}</p>
                                    </div>
                                );
                            })
                    }
                    </div>
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


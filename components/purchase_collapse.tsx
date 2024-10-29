"use client";

import { useGetClients } from "@/api/user/useClient";
import { useGetOrder, type Purchase } from "@/api/user/useOrder";
import { Product, useGetProducts, useUpdateProduct } from "@/api/user/useProduct";
import { PurchaseApproval, usePurchase, useUpdatePurchase } from "@/api/user/usePurchase";
import { PurchaseProduct, usePurchaseProduct } from "@/api/user/usePurchaseProduct";
import useRouteHandler from "@/lib/routeHandler";
import LoadingAnimation from "./loading_animation";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { set } from "react-hook-form";

interface PurchaseCollapseProps {
    purchase: Purchase;
}

const PurchaseCollapse: React.FC<PurchaseCollapseProps> = ({ purchase }) => {
    const { data: purchases, isLoading: purchaseLoading, refetch: purchaseRefetch } = usePurchase();
    const { data: clients, isLoading: clientLoading } = useGetClients();
    const { data: products, isLoading: productLoading, refetch: productsRefetch } = useGetProducts();
    const { data: purchase_products, isLoading: purchaseProductLoading } = usePurchaseProduct();
    const { data: orders, isLoading: orderLoading } = useGetOrder();

    const updatePurchase = useUpdatePurchase();
    const updateProduct = useUpdateProduct();

    const navigateToRoute = useRouteHandler();
    const isLoading = purchaseLoading || clientLoading || productLoading || purchaseProductLoading || orderLoading;

    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState<PurchaseApproval | undefined>();

    useEffect(() => {
        if (purchases && products && purchase_products) {
            const purchaseData = purchases.find((p: Purchase) => p.id === purchase.id);
            if (purchaseData) {
                const allProductsInPurchase = purchase_products.filter((pp: any) => pp.id.purchase_id === purchase.id);
                let increment = 0;

                allProductsInPurchase.forEach((pp: PurchaseProduct) => {
                    const productData = products.find((p: any) => p.id === pp.id.product_id);
                    increment += (productData?.price ?? 0) * pp.amount;
                });

                setTotal(increment);
                setStatus(purchaseData.status);
            }
        }
    }, [purchases, products, purchase_products, purchase.id]);

    if (isLoading) {
        return <LoadingAnimation />;
    }


    const purchaseData = purchases?.find((p: Purchase) => p.id === purchase.id);
    const clientData = clients?.find((c: any) => c.id === purchaseData?.clientID);
    const orderData = orders?.find((o: any) => o.id === purchaseData?.orderID);
    const allProductsInPurchase = purchase_products?.filter((pp: any) => pp.id.purchase_id === purchase.id);

    const saveHandler = async () => {
        try {
            if (!status || !purchaseData) {
                return;
            }

            const shouldDecrement = 
                (purchaseData.status === PurchaseApproval.Rejected || purchaseData.status === PurchaseApproval.Pending) &&
                status === PurchaseApproval.Approved;
            const shouldIncrement = 
                purchaseData.status === PurchaseApproval.Approved &&
                (status === PurchaseApproval.Rejected || status === PurchaseApproval.Pending);


            await updatePurchase.mutateAsync({
                purchaseID: purchase.id,
                status: status
            });

            if (products && allProductsInPurchase) {

                await Promise.all(products.map(async (product: Product) => {
                    const purchaseProduct = allProductsInPurchase.find((pp: PurchaseProduct) => pp.id.product_id === product.id);

                    if (purchaseProduct) {
                        let newRemaining = product.remaining;

                        if (shouldIncrement && !shouldDecrement) {
                            newRemaining += purchaseProduct.amount;
                        }
                        if (shouldDecrement && !shouldIncrement) {
                            newRemaining -= purchaseProduct.amount;
                        }

                        await updateProduct.mutateAsync({
                            id: product.id,
                            product: {
                                ...product,
                                remaining: newRemaining
                            }
                        });
                    }
                }));
            }

            await productsRefetch();
            await purchaseRefetch();
        } catch (error) {
            console.error(error);
        }
    }

    const statusColor = () => {
        if (status === PurchaseApproval.Approved) {
            return "text-green-500";
        }
        if (status === PurchaseApproval.Rejected) {
            return "text-red-500";
        }
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
                        {
                            allProductsInPurchase?.map((pp: PurchaseProduct) => {
                                const productData = products?.find((p: any) => p.id === pp.id.product_id);

                                return (
                                    <div key={pp.id.product_id} className="flex flex-col border rounded-md p-3 hover:bg-gray-600 hover:cursor-pointer" onClick={() => navigateToRoute(
                                        `/admin/manage_product`,
                                        pp.id.product_id
                                    )}>
                                        <div className="flex flex-row justify-between items-center">
                                            <div className="text-lg font-bold">Product</div>
                                            <div className="text-blue-500">(x{pp.amount})</div>
                                        </div>
                                        <p>ID: {productData?.id}</p>
                                        <p>Name: {productData?.name}</p>
                                        <p>Price: {productData?.price}</p>
                                        <p>Quantity: {productData?.remaining}</p>
                                        <p>Status: {productData?.status}</p>
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

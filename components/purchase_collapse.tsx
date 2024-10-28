"use client";

import { useGetClients } from "@/api/user/useClient";
import { useOrder, type Purchase } from "@/api/user/useOrder";
import { useGetProducts } from "@/api/user/useProduct";
import { usePurchase } from "@/api/user/usePurchase";
import { usePurchaseProduct } from "@/api/user/usePurchaseProduct";
import useRouteHandler from "@/lib/routeHandler";

interface PurchaseCollapseProps {
    purchase: Purchase;
}

const PurchaseCollapse: React.FC<PurchaseCollapseProps> = ({ purchase }) => {

    const { data: purchases, isLoading: purchaseLoading, error: purchaseError } = usePurchase();
    const { data: clients, isLoading: clientLoading, error: clientError } = useGetClients();
    const { data: products, isLoading: productLoading, error: productError } = useGetProducts();
    const { data: purchase_products, isLoading: purchaseProductLoading, error: purchaseProductError } = usePurchaseProduct();
    const { data: orders, isLoading: orderLoading, error: orderError } = useOrder();

    const navigateToRoute = useRouteHandler();

    if (purchaseLoading || clientLoading || productLoading || purchaseProductLoading || orderLoading) {
        return <p>Loading...</p>;
    }

    const purchaseData = purchases?.find((p: Purchase) => p.id === purchase.id);
    const clientData = clients?.find((c: any) => c.id === purchaseData?.clientID);
    const allProductsInPurchase = purchase_products?.filter((pp: any) => pp.id.purchase_id === purchase.id);
    const orderData = orders?.find((o: any) => o.id === purchaseData?.orderID);


    return (
        <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
            <div className="collapse-title text-xl font-bold">Purchase ID: {purchaseData?.id}</div>
            <div className="collapse-content flex flex-col gap-5">
                <div>
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
                <div className="grid grid-cols-2 gap-3">
                  {
                    allProductsInPurchase?.map((pp: any) => {
                      const productData = products?.find((p: any) => p.id === pp.id.product_id);
                      return (
                        <div key={pp.id.product_id} className="flex flex-col border rounded-md p-3 hover:bg-gray-600 hover:cursor-pointer" onClick={() => navigateToRoute(
                          `/admin/manage_product`,
                          pp.id.product_id
                        )}>
                          <div className="text-lg font-bold">Product</div>
                          <p>ID: {productData?.id}</p>
                          <p>Name: {productData?.name}</p>
                          <p>Price: {productData?.price}</p>
                          <p>Quantity: {pp.amount}</p>
                        </div>
                      );
                    })
                  }
                </div>
                
            </div>
        </div>
    );
};

export default PurchaseCollapse;

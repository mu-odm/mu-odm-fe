'use client';

import * as React from "react";
import { ProductDialog } from "@/components/product_size_dialog";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import { ConfirmDialog } from "@/components/confirm_dialog";
import LoadingAnimation from "@/components/loading_animation";

export default function ManageSize() {

    const { data: productSizeList, isLoading, isError, refetch } = useGetProductSizeList();

    if (isLoading) {
        return <LoadingAnimation/>
    }

    return (
        <div>
            <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
              <div className="my-2 font-bold">Sizes</div>
            </div>
            <div className="flex flex-col gap-3">
              {
                productSizeList?.map((size) => (
                  <div className="flex flex-row w-full gap-2">
                    <div key={size.id} className="flex w-full items-center justify-between border p-2 rounded-md px-3">
                      <div>{size.size}</div>
                      <div>+{size.additional_price}</div>
                    </div>
                    {
                      size.id &&
                      <ConfirmDialog product_size_id={size.id} btn_name={"del"} refetch={refetch} />
                    }
                  </div>
                ))
              }
            </div>
            <div className="w-full">
              <ProductDialog refetch={refetch} />
            </div>
          </div>
        </div>
    )
}
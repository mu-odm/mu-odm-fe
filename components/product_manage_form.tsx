'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductDialog } from "./product_size_dialog";
import RouteBackButton from "./route_back_button";
import { Product, useUpdateProduct } from "@/api/user/useProduct";
import { useEffect } from "react";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import Link from "next/link";
import { ConfirmDialog } from "./confirm_dialog";

export function ProductManageForm({ product }: { product: Product }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: product?.name,
      price: product?.price,
      status: product?.status,
      remaining: product?.remaining,
    },
  });

  useEffect(() => {
    setValue("name", product?.name);
    setValue("price", product?.price);
    setValue("status", product?.status);
    setValue("remaining", product?.remaining);
  }, [product]);

  const { data: productSizeList, isLoading, isError, refetch } = useGetProductSizeList(product?.id);

  const updateProductMutation = useUpdateProduct();

  const saveHandler = async (data: any) => {
    try {
      console.log("Updating product:", data);
      await updateProductMutation.mutateAsync({ id: product?.id, product: data });
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
        <CardDescription>Edit product detail.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(saveHandler)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                placeholder="Your Product Name"
                {...register("name")}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                placeholder="Your Product Price"
                type="number"
                step={0.01}
                {...register("price")}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="remaining">Remaining</Label>
              <Input
                id="remaining"
                placeholder="Your Product Remaining"
                type="number"
                {...register("remaining")}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={product?.status} // Set the default value for the Select
                onValueChange={(value) => setValue("status", value)} // Update form state on change
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={product?.status} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
              <ProductDialog product_id={product?.id} refetch={refetch} />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <RouteBackButton />
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

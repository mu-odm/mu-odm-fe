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
import { useUpdateProduct } from "@/api/user/useProduct";
import { useEffect } from "react";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import Link from "next/link";
import { ConfirmDialog } from "./confirm_dialog";
import useToastHandler from "@/lib/toastHandler";
import { PPS, Product, ProductSize, Status } from "@/types/db-schema";
import { useUpdatePPSByPPSID } from "@/api/user/usePPS";

interface PPSFullData extends PPS {
  product: Product;
  productSize: ProductSize;
}

export function ProductManageForm({ ppsItem }: { ppsItem: PPSFullData }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: ppsItem?.product?.name,
      price: ppsItem?.product?.price,
      status: ppsItem?.status,
      remaining: ppsItem?.remaining,
    },
  });

  useEffect(() => {
    setValue("name", ppsItem?.product?.name);
    setValue("price", ppsItem?.product?.price);
    setValue("status", ppsItem?.status);
    setValue("remaining", ppsItem?.remaining);
  }, [ppsItem]);


  const updateProductMutation = useUpdateProduct();
  const toaster = useToastHandler();
  const updatePPS = useUpdatePPSByPPSID();

  const saveHandler = async (data: any) => {
    try {
      await updateProductMutation.mutateAsync({ id: ppsItem?.product?.id, product: data });
      await updatePPS.mutateAsync({
        id: {
          product_id: ppsItem.id.product_id,
          product_size_id: ppsItem.id.product_size_id,
        },
        remaining: data.remaining,
        status: data.status,
      });

      toaster("success", "Product updated successfully");
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
                defaultValue={ppsItem?.status} // Set the default value for the Select
                onValueChange={(value: Status) => setValue("status", value)} // Update form state on change
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={ppsItem?.status} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
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

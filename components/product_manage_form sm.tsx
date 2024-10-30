'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { ProductDialog } from "@/components/product_size_dialog sm";
import { PPS, Product, ProductSize } from "@/types/db-schema";
import { useUpdateProduct } from "@/api/user/useProduct";
import { useEffect } from "react";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import { useGetPPSByProductId } from "@/api/user/usePPS";
import useToastHandler from "@/lib/toastHandler";

interface ProductManageFormProps {
  product: Product;
  availableSizes: ProductSize[];
  selectedSizes: ProductSize[];
  onClose: () => void;
  onChange: (updatedProductDetail: {
    name: string;
    price: number;
    amount: number;
    status: string;
  }) => void;
}

export function ProductManageForm({ product, onClose }: ProductManageFormProps) {
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

  const { data: productSizeList } = useGetProductSizeList();
  const { data: ppsData } = useGetPPSByProductId(product?.id);
  const updateProductMutation = useUpdateProduct();
  const toaster = useToastHandler();

  const saveHandler = async (data: any) => {
    try {
      await updateProductMutation.mutateAsync({ id: product?.id, product: data });
      toaster("success", "Product updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <div>{/* Optional header content */}</div>
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
                defaultValue={product?.status}
                onValueChange={(value) => setValue("status", value)}
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
              {ppsData?.map((ppsItem: PPS) => {
                const productSize = productSizeList?.find(
                  (size: ProductSize) => size.id === ppsItem.id.product_size_id
                );

                if (!productSize) return null;

                return (
                  <div className="flex flex-row w-full gap-2" key={ppsItem.id.product_size_id}>
                    <div className="flex w-full items-center justify-between border p-2 rounded-md px-3">
                      <div>{productSize.size}</div>
                      <div>+{productSize.additional_price}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full">
              <ProductDialog product_id={product?.id} refetch={() => {/* Refetch logic */}} />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

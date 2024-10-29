'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSize, useCreateProductSize } from "@/api/user/useProductSize";

export function ProductDialog({ product_id, refetch }: { product_id: string, refetch: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createProductSize = useCreateProductSize();

  const onSubmit = async (data: any) => {
    const productSize: ProductSize = {
      size: data.name,
      additional_price: data.additional_price,
      product_id: product_id
    };

    try {
      await createProductSize.mutateAsync(productSize);
      refetch();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating product size:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Size Configuration</DialogTitle>
          <DialogDescription>
            Create size for this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onClick={(event) => event.stopPropagation()}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Size Name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Size Name is required" })}
                className="col-span-3"
              />
              {errors.name && (
                <p className="text-red-500 col-span-4">{String(errors.name.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additional_price" className="text-right">
                Additional Price
              </Label>
              <Input
                id="additional_price"
                type="number"
                {...register("additional_price", { required: "Additional Price is required" })}
                className="col-span-3"
              />
              {errors.additional_price && (
                <p className="text-red-500 col-span-4">{String(errors.additional_price.message)}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

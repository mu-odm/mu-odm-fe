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
import { useDeleteProductSize } from "@/api/user/useProductSize";

export function ConfirmDialog({ btn_name, product_size_id, refetch }: {btn_name: string, product_size_id: string, refetch: () => void}) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteProductSize = useDeleteProductSize();

  const onSubmit = async () => {
    try {
        await deleteProductSize.mutateAsync(
            product_size_id
        );
        setIsOpen(false);
        refetch();
        } catch (error) {
        console.error("Error deleting product size:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="btn bg-red-500 text-white" onClick={(e) => {
            e.stopPropagation();
        }}>
          {btn_name}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            This alert ensures that you continue the process by purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="btn" onClick={() => onSubmit()}>Yes</div>
      </DialogContent>
    </Dialog>
  );
}

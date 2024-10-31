import { SetStateAction, useState } from "react";
import { useUpdateProduct } from "@/api/user/useProduct";
import { PPS, Product, ProductSize, Status } from "@/types/db-schema";
import { ProductManageForm } from "@/components/product_manage_form sm";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import { useUpdatePPSByPPSID } from "@/api/user/usePPS";
import LoadingAnimation from "./loading_animation";

type CardProps = {
  id: string;
  title: string;
  price: number;
  status: Status;
  amount: number;
  size: string;
  sizeID: string;
};

export default function Card({ id, title, price, status, amount, size, sizeID }: CardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedAmount, setEditedAmount] = useState(amount);
  const [editedSize, setEditedSize] = useState<string[]>([]);

  const updateProductMutation = useUpdateProduct();
  const updatePPS = useUpdatePPSByPPSID();
  const { data: sizes, isLoading: loadingSizes, error } = useGetProductSizeList();

  if (loadingSizes) {
    return <LoadingAnimation/>
  }

  const handleCardClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveChanges = async () => {
    const updatedData: Product = {
      id,
      name: editedTitle,
      price: editedPrice,
    };

    editedSize.forEach(async (size) => {
      const updatedStatusAndRemaining: PPS = {
        id: {
          product_id: id,
          product_size_id: size,
        },
        remaining: editedAmount,
        status: editedStatus,
      };

      await updatePPS.mutateAsync(updatedStatusAndRemaining,
        {
          onSuccess: (updatedStatusAndRemaining) => {
            setEditedStatus(editedStatus);
            setEditedAmount(editedAmount);
          },
          onError: (error) => {
            console.error("Error updating PPS:", error);
            alert("Failed to update PPS. Please try again.");
          },
        }
      );
    });

    updateProductMutation.mutate(
      { id, product: updatedData },
      {
        onSuccess: (updatedProduct) => {
          setEditedTitle(updatedProduct.name);
          setEditedPrice(updatedProduct.price);
          
          alert("Product updated successfully!");
          setIsModalVisible(false);
        },
        onError: (error) => {
          console.error("Error updating product:", error);
          alert("Failed to update product. Please try again.");
        },
      }
    );
  };

  if (loadingSizes) {
    return <p>Loading sizes...</p>;
  }

  if (error) {
    return <p>Error loading sizes: {error.message}</p>;
  }

  return (
    <>
      <div
        className="relative flex flex-col w-full max-w-xs h-auto rounded overflow-hidden shadow-lg bg-red-500 cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:bg-red-600"
        onClick={handleCardClick}
      >
        <div className="px-4 py-2 flex flex-col h-full">
          <div className="font-bold text-sm mb-1 text-white truncate">{title}</div>
          <p className="text-white text-xs mb-1">Price: ${price}</p>
          <p className="text-white text-xs">Status: {status}</p>
          <p className="text-white text-xs">Remaining: {amount}</p>
          <p className="text-white text-xs">Size: {size}</p>
        </div>
      </div>

      {sizes && isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Product</h2>

            <ProductManageForm
              exProduct={{
                id,
                name: editedTitle,
                price: editedPrice,
                remaining: editedAmount,
                status: editedStatus,
                size: [],
                productSizeID: sizeID,
              }}
              availableSizes={sizes}
              selectedSizes={sizes.filter((size) => size)} 
              onClose={handleCloseModal}
              onChange={(updatedProductDetail: {
                name: SetStateAction<string>;
                price: SetStateAction<number>;
                amount: SetStateAction<number>;
                status: SetStateAction<string>;
              }) => {
                setEditedTitle(updatedProductDetail.name);
                setEditedPrice(updatedProductDetail.price);
                setEditedAmount(updatedProductDetail.amount);
                setEditedStatus(editedStatus);
              }}
            />

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

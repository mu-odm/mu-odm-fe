import { SetStateAction, useState } from "react";
import { useUpdateProduct } from "@/api/user/useProduct";
import { Product } from "@/types/db-schema";
import { ProductManageForm } from "@/components/product_manage_form sm";
import { useGetProductSizeList } from "@/api/user/useProductSize";

type CardProps = {
  id: string;
  title: string;
  price: number;
  status: string;
  amount: number;
};

export default function Card({ id, title, price, status, amount }: CardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedAmount, setEditedAmount] = useState(amount);

  const updateProductMutation = useUpdateProduct();
  const { data: sizes = [], isLoading: loadingSizes, error } = useGetProductSizeList();

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
      remaining: editedAmount,
      status: editedStatus,
    };

    updateProductMutation.mutate(
      { id, product: updatedData },
      {
        onSuccess: (updatedProduct) => {
          setEditedTitle(updatedProduct.name);
          setEditedPrice(updatedProduct.price);
          setEditedStatus(updatedProduct.status);
          setEditedAmount(updatedProduct.remaining);
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
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Product</h2>

            <ProductManageForm
              product={{
                id,
                name: editedTitle,
                price: editedPrice,
                remaining: editedAmount,
                status: editedStatus,
                size: [], // Provide selected sizes if applicable
              }}
              availableSizes={sizes} // Pass the sizes array directly
              selectedSizes={sizes.filter((size) => size)} // Filter undefined values
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
                setEditedStatus(updatedProductDetail.status);
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

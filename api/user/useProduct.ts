
import axios from "@/lib/axiosInstance";
import { getSession } from "next-auth/react";


export interface ApiProduct {
  name: string;
  price: number;
  imageUrl: string; // Include this property
  status: string;
  amount: number;
  page: string; // Include this property
}

const fetchProducts = async (): Promise<ApiProduct[]> => {
  const session = await getSession();
  const { data } = await axios.get<ApiProduct[]>("/products", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`
    }
  });

  return data; // This should be an array of ApiProduct
};

export const handleAddProduct = async (name: string, price: number, amount: number, status: string) => {
    const session = await getSession(); // Get the session for the token
    const response = await axios.post(
      "/products",
      {
        name: name,
        price: price,
        status: status,
        remaining: amount
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
          Authorization: `Bearer ${session?.accessToken}` // Use the token from the session
        }
      }
    );
    console.log(response.data);
    alert("Product added successfully!");
  
};


export default fetchProducts;


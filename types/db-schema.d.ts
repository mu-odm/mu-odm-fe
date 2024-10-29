export interface Client {
  user_id: any;
  id?: string;
  email: string;
  name: string;
  contract_year: number;
  location: string;
  contact: string;
  deferStatus: boolean;
}

export interface AddClient {
  user_id: any;
  id: string;
  email: string;
  name: string;
  contract_year: number;
  location: string;
  contact: string;
  deferStatus: boolean;
}

export enum Status {
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface Order {
  id: string;
  purchases: Purchase[];
  status: Status;
  region: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  remaining: number;
  status: string;
  size?: string[]; // Add size property here if applicable
}


// Assuming your ProductInput type is defined like this
export type ProductInput = {
  name: string;
  price: number;
  remaining: number;
  status: string;
  size: string; // This could be an array if you want it to be flexible
  sizes?: string[]; // Add this line if you want to support multiple sizes
};


export interface ProductSize {
  id?: string;
  size: string;
  additional_price: number;
}

export enum PurchaseApproval {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface Purchase {
  id: string;
  orderID: string;
  clientID: string;
  created_at: string;
  status: PurchaseApproval;
}

interface PurchaseProductKey {
  purchase_id: string;
  product_id: string;
}

export interface PurchaseProduct {
  id: PurchaseProductKey;
  productID: string;
  clientID: string;
  amount: number;
}

export interface User {
  username: string;
  email: string;
  region: string;
  role: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  region: string;
}

export interface CreatePurchaseProductParams {
  amount: number;
  clientID: string;
  productID: string;
}

interface PPSProductId {
  product_id: string;
  product_size_id: string;
}


export interface PPS {
  id: PPSProductId; 
  product_id: string; 
  product_size_id: string; 
}
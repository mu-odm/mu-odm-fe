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
  status: string;
  remaining: number;
}

interface ProductInput {
  name: string;
  price: number;
  remaining: number;
  status: string;
}

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

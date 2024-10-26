'use client';

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductDialog } from "./product_size_dialog"
import RouteBackButton from "./route_back_button";

export function ProductManageForm({ card_detail }: any) {

  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
        <CardDescription>Edit product detail.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="product_name">Product Name</Label>
              <Input 
                id="product_name" 
                placeholder="Your Product Name" 
                value={card_detail.name}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                placeholder="Your Product Name"
                value={card_detail.price}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="Your Product Name" 
                value={card_detail.amount}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Status</Label>
              <Select defaultValue={card_detail.status}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <div className="mt-10">
          <div className="my-2 font-bold">Size</div>
          <div className="flex flex-col gap-3">
            {
              card_detail.size.map((size: any) => (
                <div key={size.id} className="flex flex-row justify-between border p-2 rounded-md">
                  <div>{size.name}</div>
                  <div>+{size.additional_price} Baht</div>
                </div>
              ))
            }
          </div>
          <div className="w-full">
            <ProductDialog/>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <RouteBackButton/>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
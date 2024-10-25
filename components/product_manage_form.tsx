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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Back</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}

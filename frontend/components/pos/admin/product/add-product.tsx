"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, UploadCloud, PackagePlus, X } from "lucide-react";
import Image from "next/image";
import { Field, FieldLabel } from "@/components/ui/field";

export function AddProduct() {
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  return (
    <Dialog onOpenChange={(open) => !open && setPreview(null)}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md active:scale-95">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120 p-0 overflow-hidden border-none shadow-2xl">
        <form>
          <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b">
            <div className="flex items-center gap-2 mb-1">
              <PackagePlus className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-xl">Add New Product</DialogTitle>
            </div>
            <DialogDescription>
              Enter the product details to update your inventory stock.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Image Upload & Preview Area */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Product Image
              </Label>

              {!preview ? (
                <label
                  htmlFor="image"
                  className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-xl bg-muted/20 hover:bg-muted/40 hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-blue-500 transition-colors mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">
                      Images only (PNG, JPG, or WebP)
                    </p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/png, image/webp, image/jpg"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative h-32 w-full rounded-xl overflow-hidden border border-border">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Product Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ice Latte"
                className="bg-muted/30 focus:bg-background"
              />
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="description"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Product Description
              </FieldLabel>
              <Textarea
                id="description"
                placeholder="Enter product description here"
                className="min-h-25 break-all whitespace-pre-wrap overflow-hidden"
              />
            </div>

            {/* Pricing & Stock Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Price ($)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0"
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Stock Units
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  className="bg-muted/30"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                variant="ghost"
                type="button"
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Save to Inventory
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

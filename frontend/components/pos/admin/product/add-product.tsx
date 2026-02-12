"use client";

import * as React from "react";
import Image from "next/image";
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
import {
  Plus,
  UploadCloud,
  PackagePlus,
  X,
  Box,
  DollarSign,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { FieldLabel } from "@/components/ui/field";
import { addProductForm } from "@/actions/product/addProductForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AddProduct() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(addProductForm, null);
  const [open, setOpen] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const removeImage = () => {
    setPreview(null);
    // remove the value input as well, or else the admin cannot upload the same image twice
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // use this to get toast message and refresh UI after add new product
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      toast.success("Product Created Successfully", {
        position: "top-right",
        duration: 3000,
        className: cn(
          "group !bg-white dark:!bg-slate-950", // Background
          "!border-emerald-500/20 dark:!border-emerald-500/30", // Border
          "!text-emerald-900 dark:!text-emerald-50", // Text
          "shadow-2xl backdrop-blur-md", // Elevation
        ),
        icon: (
          <div className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </div>
        ),
        style: {
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
      setPreview(null);
    }
  }, [state?.success]);

  useEffect(() => {
    removeImage();
  }, [state?.errors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md active:scale-95">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120 p-0 overflow-hidden border-none shadow-2xl">
        <form action={formAction}>
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
            {/* Image Upload Area */}
            <div className="space-y-2">
              <Label
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  state?.errors?.image_url && "text-red-600",
                )}
              >
                Product Image
              </Label>

              {preview ? (
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
              ) : (
                <label
                  htmlFor="image"
                  className={cn(
                    "group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-xl bg-muted/20 hover:bg-muted/40 hover:border-blue-400 transition-all cursor-pointer",
                    state?.errors && "border-red-500",
                  )}
                >
                  <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-blue-500 transition-colors mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Click to upload image
                  </p>
                </label>
              )}

              {/* File cannot have pre-filled which is defaultValue */}
              <Input
                id="image"
                name="image_url"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {state?.errors?.image_url ? (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.image_url[0]}
                </p>
              ) : (
                state?.errors && (
                  <p className="text-xs text-red-600 mt-1">
                    Please re-select the image
                  </p>
                )
              )}
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  state?.errors?.name && "text-red-600",
                )}
              >
                Product Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={state?.inputs?.name?.toString()}
                aria-invalid={!!state?.errors?.name}
                placeholder="e.g. Ice Latte"
                className="bg-muted/30 focus:bg-background"
                autoComplete="organization-title"
              />
              {state?.errors?.name && (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="description"
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  state?.errors?.description && "text-red-600",
                )}
              >
                Product Description
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                defaultValue={state?.inputs?.description?.toString()}
                aria-invalid={!!state?.errors?.description}
                placeholder="Brief details about origin, flavor, or popularity..."
                className="min-h-24 resize-none"
                autoComplete="off"
              />
              {state?.errors?.description && (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            {/* Pricing & Stock Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                    state?.errors?.price && "text-red-600",
                  )}
                >
                  Price ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    defaultValue={state?.inputs?.price?.toString()}
                    aria-invalid={!!state?.errors?.price}
                    placeholder="4.99"
                    className="pl-9 bg-muted/30 focus:bg-white"
                    autoComplete="transaction-amount"
                  />
                </div>
                {state?.errors?.price && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.price[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="stock_quantity"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                    state?.errors?.stock_quantity && "text-red-600",
                  )}
                >
                  Stock Level
                </Label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    defaultValue={state?.inputs?.stock_quantity?.toString()}
                    aria-invalid={!!state?.errors?.stock_quantity}
                    placeholder="100"
                    className="pl-9 bg-muted/30 focus:bg-white"
                    autoComplete="off"
                  />
                </div>
                {state?.errors?.stock_quantity && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.stock_quantity[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t">
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
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isPending ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

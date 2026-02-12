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
import { UploadCloud, X, Box, DollarSign, Edit3 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { editProductForm } from "@/actions/product/editProductForm";
import { toast } from "sonner";
import { Product } from "@/types/productType";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";

export function EditProduct({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess?: () => void;
}) {
  const [preview, setPreview] = React.useState<string | null>(
    product.image_url || null,
  );

  const [state, formAction, isPending] = useActionState(editProductForm, null);
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

    const fileInput = document.getElementById(
      `edit-image-${product.id}`,
    ) as HTMLInputElement;

    if (fileInput) fileInput.value = "";
  };

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      if (onSuccess) onSuccess();
      toast.success("Product Updated Successfully", {
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
    }
  }, [state?.success]);

  useEffect(() => {
    if (state?.errors) {
      toast.error(state.message, {
        position: "top-right",
        duration: 4000,
        className: cn(
          "group !bg-white dark:!bg-slate-950",
          "!border-rose-500/20 dark:!border-rose-500/30", // Rose border
          "!text-rose-900 dark:!text-rose-50", // Rose text
          "shadow-2xl backdrop-blur-md",
          "!w-max !max-w-[80vw] whitespace-nowrap", // make the message stay in one-line
        ),
        icon: (
          <div className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
          </div>
        ),
        style: {
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    }
  }, [state?.errors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover:bg-slate-100 flex mt-1 items-center w-full px-2 py-1.5 transition-all text-sm cursor-pointer rounded-sm">
          <Edit3 className="mr-3 h-4 w-4 text-blue-500" />
          <span>Edit Product</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120 p-0 overflow-hidden border-none shadow-2xl">
        <form action={formAction}>
          <input type="hidden" name="id" value={product.id} />

          <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b">
            <div className="flex items-center gap-2 mb-1">
              <Edit3 className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-xl">Edit Product</DialogTitle>
            </div>
            <DialogDescription>
              Updating product's name: {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Image Area */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                  htmlFor={`edit-image-${product.id}`}
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
              <Input
                id={`edit-image-${product.id}`}
                name="image_url"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor={`name-${product.id}`}
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  state?.errors?.name && "text-red-600",
                )}
              >
                Product Name
              </Label>
              <Input
                id={`name-${product.id}`}
                name="name"
                defaultValue={product.name}
                aria-invalid={!!state?.errors?.name}
                className="bg-muted/30 focus:bg-background"
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
                htmlFor={`description-${product.id}`}
                className={cn(
                  "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  state?.errors?.description && "text-red-600",
                )}
              >
                Product Description
              </FieldLabel>
              <Textarea
                id={`description-${product.id}`}
                name="description"
                defaultValue={product.description}
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

            {/* Price & Stock */}
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
                    id={`price-${product.id}`}
                    name="price"
                    defaultValue={product.price}
                    aria-invalid={!!state?.errors?.price}
                    className="pl-9 bg-muted/30"
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
                  htmlFor={`stock-${product.id}`}
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
                    id={`stock-${product.id}`}
                    name="stock_quantity"
                    defaultValue={product.stock_quantity}
                    aria-invalid={!!state?.errors?.stock_quantity}
                    className="pl-9 bg-muted/30"
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

          <DialogFooter className="p-6 bg-slate-50 border-t">
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
              {isPending ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

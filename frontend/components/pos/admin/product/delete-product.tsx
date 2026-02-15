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
import { Trash2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Product } from "@/types/productType";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { deleteProductForm } from "@/actions/product/deleteProductForm";

export function DeleteProduct({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(async (_: any) => {
    return await deleteProductForm(product.id, _);
  }, null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      if (onSuccess) onSuccess();
      toast.success("Product Deleted Successfully", {
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
          <Trash2 className="mr-3 h-4 w-4 text-red-600" />
          <span className="text-red-600">Delete</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none shadow-2xl">
        {/* Top Accent Bar */}
        <div className="h-1 bg-red-500 w-full" />

        <div className="p-6 pt-8">
          <DialogHeader className="flex flex-col items-center">
            {/* Product Image with Styled Container */}
            <div className="relative mb-4 group">
              <div className="absolute inset-0 bg-red-100 rounded-2xl rotate-6 transition-transform group-hover:rotate-12" />
              <div className="relative bg-white p-2 rounded-2xl border shadow-sm flex-center overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="object-contain rounded-lg transition-transform group-hover:scale-115"
                />
              </div>
            </div>

            <DialogTitle className="text-2xl font-bold text-slate-900">
              Delete Product?
            </DialogTitle>

            <DialogDescription className="text-center text-slate-500 mt-2 px-4 leading-relaxed">
              You're about to delete{" "}
              <span className="font-semibold text-slate-900 underline decoration-red-300 underline-offset-4 leading-loose capitalize">
                "{product.name}"
              </span>
              . All associated data will be lost forever.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex flex-row items-center gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-semibold transition-colors h-11"
              >
                No, keep it
              </Button>
            </DialogClose>

            <form action={formAction} className="flex-1">
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="w-full h-11 bg-red-600 hover:bg-red-700 shadow-md shadow-red-200 dark:shadow-none font-semibold transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
            </form>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

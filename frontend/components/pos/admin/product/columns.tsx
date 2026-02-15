"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { EditProduct } from "./edit-product";
import { Product } from "@/types/productType";
import { useState } from "react";
import { DeleteProduct } from "./delete-product";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Product
        </Button>
      );
    },
    cell: ({ row }) => {
      const { image_url, name } = row.original;

      return (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/50 shadow-sm">
            {image_url ? (
              <Image
                src={image_url}
                alt={name}
                fill
                className="object-cover transition-transform hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-[10px] text-muted-foreground font-bold">
                IMAGE
              </div>
            )}
          </div>
          <span className="font-bold text-foreground leading-none mb-1 min-w-35">
            {name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1 max-w-50 text-xs">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "stock_quantity",
    header: "Stock Level",
    cell: ({ row }) => {
      const stock = row.getValue("stock_quantity") as number;
      const max = row.original.maxStock || 100;
      const percentage = Math.min(Math.round((stock / max) * 100), 100);

      const statusColor =
        percentage <= 20
          ? "bg-red-600"
          : percentage < 50
            ? "bg-orange-600"
            : "bg-green-600";

      return (
        <div className="flex flex-col gap-1.5 min-w-30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">{stock} units</span>
            <span className="text-muted-foreground">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={statusColor}
              style={{ width: `${percentage}%`, height: "100%" }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-right font-black text-foreground">{formatted}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      const [dropdownOpen, setDropdownOpen] = useState(false);

      return (
        <div className="text-right">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Actions
              </DropdownMenuLabel>

              <EditProduct
                product={product}
                onSuccess={() => setDropdownOpen(false)}
              />

              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                asChild
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Link href={`/admin/product`}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Link>
              </DropdownMenuItem> */}
              <DeleteProduct
                product={product}
                onSuccess={() => setDropdownOpen(false)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

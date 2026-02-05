import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RenderCard from "./render-card";

const ProductPage = () => {
  const data = [
    {
      id: "rec-001",
      name: "Classic Ice Latte",
      category: "Iced Coffee",
      description:
        "Our signature espresso chilled over ice with silky smooth milk.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 15,
      price: 4.5,
    },
    {
      id: "rec-002",
      name: "Midnight Chocolate Latte",
      category: "Specialty",
      description:
        "Rich dark chocolate melted into double-shot espresso and steamed milk.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 8,
      price: 5.99,
    },
    {
      id: "rec-003",
      name: "Velvet Hot Latte",
      category: "Hot Coffee",
      description:
        "The classic morning companion. Perfectly frothed and balanced.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 50,
      price: 4.25,
    },
    {
      id: "rec-004",
      name: "Caramel Macchiato",
      category: "Sweetened",
      description:
        "Freshly steamed milk with vanilla-flavored syrup marked with espresso.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 22,
      price: 6.5,
    },
    {
      id: "rec-005",
      name: "Vanilla Bean Flat White",
      category: "Hot Coffee",
      description:
        "Short and strong espresso shots with a hint of natural vanilla.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 12,
      price: 5.25,
    },
    {
      id: "rec-006",
      name: "Hazelnut Praline Latte",
      category: "Specialty",
      description:
        "Toasted hazelnut notes combined with our premium house blend.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 30,
      price: 5.75,
    },
    {
      id: "rec-007",
      name: "Oat Milk Honey Latte",
      category: "Dairy-Free",
      description:
        "Creamy oat milk and local honey for a guilt-free energy boost.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 18,
      price: 6.25,
    },
    {
      id: "rec-008",
      name: "Matcha Green Tea Latte",
      category: "Non-Coffee",
      description:
        "Premium ceremonial grade matcha whisked with your choice of milk.",
      imageUrl:
        "https://res.cloudinary.com/dbn9nkjum/image/upload/v1748955142/b3fkfpiv8l03diek8xoq.png",
      stock: 40,
      price: 5.5,
    },
  ];

  return (
    <div className="px-4 py-8 pr-14 bg-background text-foreground min-h-screen">
      {/* Breadcrumbs & Header */}
      <nav className="flex items-center space-x-2 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your product catalog, stock levels and pricing.
          </p>
        </div>
        <Link
          href="/add"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-blue-600 hover:bg-blue-700 text-white",
          )}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Render Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RenderCard title="TOTAL PRODUCTS" value="8" category="product" />
        <RenderCard title="LOW STOCK ALERTS" value="4" category="stock" />
        <RenderCard title="INVENTORY VALUE" value="$252" category="inventory" />
      </div>

      {/* Products Table */}
      <div className="py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ProductPage;

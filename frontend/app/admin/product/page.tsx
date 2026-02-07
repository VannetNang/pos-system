import Link from "next/link";
import { DataTable } from "@/components/pos/admin/product/data-table";
import { columns } from "@/components/pos/admin/product/columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RenderCard from "@/components/pos/admin/product/render-card";
import { AddProduct } from "@/components/pos/admin/product/add-product";
import { Product } from "@/types/productType";

const ProductPage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

  const result = await response.json();

  const data: Product[] = result?.data?.products;

  // Calculate total products value
  const totalSum = data.reduce((sum, product) => {
    return sum + Number(product.price);
  }, 0);

  const inventoryValue = `$${totalSum.toFixed(2)}`;

  // Calculate total low stocks
  const totalLowStocks = data.filter((product) => {
    return product.stock_quantity <= 20;
  });

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

        <AddProduct />
      </div>

      {/* Render Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RenderCard
          title="TOTAL PRODUCTS"
          value={data.length}
          category="product"
        />
        <RenderCard
          title="LOW STOCK ALERTS"
          value={totalLowStocks.length}
          category="stock"
        />
        <RenderCard
          title="INVENTORY VALUE"
          value={inventoryValue}
          category="inventory"
        />
      </div>

      {/* Products Table */}
      <div className="py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ProductPage;

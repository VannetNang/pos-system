import CheckoutDashboard from "@/components/pos/staff/checkout-dashboard";
import ProductCollection from "@/components/pos/staff/product-collection";
import SearchBar from "@/components/shared/search-bar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const StaffDashboard = () => {
  return (
    <div className="grid grid-cols-3 mt-3">
      <div className="col-span-2">
        {/* navbar */}
        <div className="flex">
          <SidebarTrigger />
          <div className="w-full">
            <SearchBar />
          </div>
        </div>

        <hr className="my-3" />

        {/* product collection display */}
        <ProductCollection />
      </div>

      {/* checkout dashboard */}
      <CheckoutDashboard />
    </div>
  );
};

export default StaffDashboard;

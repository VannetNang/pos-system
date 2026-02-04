import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductCollection = () => {
  return (
    <div className="py-4 px-8  grid grid-cols-4 gap-8">
      <Card className="group relative mx-auto w-full max-w-70 py-0 overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500&auto=format&fit=crop"
            alt="Ice Latte"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Ice Latte</CardTitle>
              <CardDescription className="line-clamp-2">
                Refreshing espresso with chilled milk Refreshing espresso with
                chilled milk
              </CardDescription>
            </div>
            <span className="text-lg font-bold">$4.50</span>
          </div>
        </CardHeader>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full transition-colors">Add To Cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCollection;

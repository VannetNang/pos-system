import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CircleDollarSign, Package } from "lucide-react";

const RenderCard = ({ title, value, category }: any) => {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
        <div className="flex items-baseline justify-between">
          <h6
            className={cn(
              "text-3xl font-bold text-foreground",
              category === "product" && "text-blue-500",
              category === "stock" && "text-red-600",
              category === "inventory" && "text-green-600",
            )}
          >
            {value}
          </h6>
          {category === "product" && (
            <span className="text-xs text-blue-500 px-2 py-1 rounded-md font-bold italic flex-center gap-2">
              <Package width={15} /> Products
            </span>
          )}
          {category === "stock" && (
            <span className="text-xs text-red-600 px-2 py-1 rounded-md font-bold italic flex-center gap-2">
              <AlertTriangle width={15} /> Action required
            </span>
          )}
          {category === "inventory" && (
            <span className="text-xs text-green-600 px-2 py-1 rounded-md font-bold italic flex-center gap-2">
              <CircleDollarSign width={15} /> Value
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RenderCard;

import { DollarSign, Edit, Trash } from "lucide-react";
import { ProductData } from "../../lib/types";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface ProductCardProps {
  product: ProductData;
  onEdit: (product: ProductData) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all group hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
          <div className="absolute flex gap-2 transition-all translate-y-full opacity-0 bottom-2 right-2 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(product)}
              className="w-8 h-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(product.id)}
              className="w-8 h-8"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-lg font-bold text-gray-800">{product.name}</p>

          <Badge variant="default">
            <DollarSign className="w-4 h-4" />
            {product.price}
          </Badge>
        </div>
        <p className="text-sm font-semibold text-gray-500">{product.brand}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardFooter>
    </Card>
  );
}

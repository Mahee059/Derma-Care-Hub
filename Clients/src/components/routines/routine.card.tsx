import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { RoutineData } from "../../lib/types";

interface RoutineCardProps {
  routine: RoutineData;
  onEdit: (routine: RoutineData) => void;
  onDelete: (id: string) => void;
}

export default function RoutineCard({
  routine,
  onEdit,
  onDelete,
}: RoutineCardProps) {
  const getRoutineImage = (type: string) => {
    if (type.toLowerCase().includes("morning")) {
      return "https://images.pexels.com/photos/4045607/pexels-photo-4045607.jpeg";
    } else if (type.toLowerCase().includes("night")) {
      return "https://images.pexels.com/photos/573238/pexels-photo-573238.jpeg";
    } else if (type.toLowerCase().includes("weekly")) {
      return "https://images.pexels.com/photos/31745943/pexels-photo-31745943/free-photo-of-woman-in-green-jacket-walking-dog-outdoors.jpeg";
    } else {
      return "https://images.pexels.com/photos/3036525/pexels-photo-3036525.jpeg";
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(routine.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(routine);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video bg-muted">
        <img
          src={getRoutineImage(routine.type)}
          alt={routine.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="px-2 py-1 text-xs text-white rounded-full bg-primary/90">
            {routine.type}
          </span>
        </div>
      </div>

      <CardHeader className="py-4">
        <CardTitle className="text-lg">{routine.name}</CardTitle>
      </CardHeader>

      <CardFooter className="flex justify-between py-4">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}


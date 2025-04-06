import { useAtom } from "jotai/react";

import { photosQueryAtom } from "@/features/photosQueryAtom";

import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function PhotoSort() {
  const [photosQuery, setPhotosQuery] = useAtom(photosQueryAtom);

  const handleSortChange = (value: string) => {
    setPhotosQuery((prev) => ({
      ...prev,
      sort: value as "name" | "date",
    }));
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      <Label>Sort by:</Label>
      <Select onValueChange={handleSortChange} defaultValue={photosQuery.sort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

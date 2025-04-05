import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Photo } from "@/features/models";
import { useDeletePhotoById } from "@/features/queries";

import { PhotoDisplay } from "./PhotoDisplay";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PhotoDetailsDialogProp {
  photo: Photo;
}

export function PhotoDetailsDialog({ photo }: PhotoDetailsDialogProp) {
  const { name, upload_date, url } = photo;
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const deletePhoto = useDeletePhotoById();
  const formattedDate = dayjs(upload_date).format("YYYY-MM-DD");

  const handleDelete = () => {
    deletePhoto.mutate(photo.id);
    setShowDelete(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PhotoDisplay photo={photo} setOpen={() => setOpen(true)} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="flex flex-row gap-4 items-center">
          <div className="flex flex-col gap-0">
            <DialogTitle className="text-lg font-semibold select-none">
              {name}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-xs select-none">
              {formattedDate}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div
          className="h-[32rem] w-full relative"
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
        >
          <img src={url} alt={name} className="w-full h-full object-cover" />
          {showDelete && (
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={handleDelete}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

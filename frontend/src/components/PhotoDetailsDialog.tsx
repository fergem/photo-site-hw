import dayjs from "dayjs";
import { useState } from "react";

import { Photo } from "@/features/models";
import { useDeletePhotoById } from "@/features/queries";

import { PhotoDisplay } from "./PhotoDisplay";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PhotoDetailsDialogProp {
  photo: Photo;
}

export function PhotoDetailsDialog({ photo }: PhotoDetailsDialogProp) {
  const { name, uploadDate, url } = photo;
  const [open, setOpen] = useState(false);
  const deletePhoto = useDeletePhotoById();
  const formattedDate = dayjs(uploadDate).format("YYYY-MM-DD HH:mm");

  const handleDelete = () => {
    deletePhoto.mutate(photo.id);
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

        <div className="h-[32rem] w-full relative">
          <img
            src={url}
            alt={name}
            className="w-full h-full object-cover  rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

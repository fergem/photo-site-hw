import dayjs from "dayjs";
import { useState } from "react";

import { Photo } from "@/features/models";

import { PhotoDisplay } from "./PhotoDisplay";
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
  const formattedDate = dayjs(upload_date).format("YYYY-MM-DD");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PhotoDisplay photo={photo} setOpen={() => setOpen(true)} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold select-none">
            {name}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs select-none">
            {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="h-[32rem] w-full">
          <img src={url} alt={name} className="w-full h-full object-cover" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

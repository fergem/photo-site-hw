import dayjs from "dayjs";

import { Photo } from "@/features/models";

interface PhotoDisplayProps {
  photo: Photo;
  setOpen: () => void;
}

export function PhotoDisplay({ photo, setOpen }: PhotoDisplayProps) {
  const { name, uploadDate, url } = photo;
  const formattedDate = dayjs(uploadDate).format("YYYY-MM-DD HH:mm");

  return (
    <div
      onClick={setOpen}
      className="flex flex-col items-center justify-center col-span-1 hover:scale-105 transition-transform duration-200 cursor-pointer"
    >
      <img
        src={url}
        alt={name}
        className="w-64 h-64 object-cover rounded-lg shadow-lg"
      />
      <h2 className="mt-1 text-lg font-semibold select-none">{name}</h2>
      <p className="text-gray-500 text-xs select-none">{formattedDate}</p>
      <p className="text-gray-500 text-xs select-none">
        {photo.numberOfPeople >= 0
          ? `${photo.numberOfPeople} people`
          : "Nobody found"}
      </p>
    </div>
  );
}

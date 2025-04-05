import dayjs from "dayjs";

import { Photo } from "@/features/models";

interface PhotoDisplayProps {
  photo: Photo;
}

export function PhotoDisplay({ photo }: PhotoDisplayProps) {
  const { name, upload_date, url } = photo;
  const formattedDate = dayjs(upload_date).format("YYYY-MM-DD");

  return (
    <div className="flex flex-col items-center justify-center col-span-1 hover:scale-105 transition-transform duration-200 cursor-pointer">
      <img
        src={url}
        alt={name}
        className="w-64 h-64 object-cover rounded-lg shadow-lg"
      />
      <h2 className="mt-1 text-lg font-semibold select-none">{name}</h2>
      <p className="text-gray-500 text-xs select-none">{formattedDate}</p>
    </div>
  );
}

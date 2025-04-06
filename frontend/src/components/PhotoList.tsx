import { useFetchPhotos } from "@/features/queries";

import { PhotoDetailsDialog } from "./PhotoDetailsDialog";
import { PhotoPagination } from "./PhotoPagination";
import { PhotoSort } from "./PhotoSort";
import { QueryLoader } from "./QueryLoader";

export function PhotoList() {
  const photosQuery = useFetchPhotos();

  return (
    <div className="mx-auto p-10">
      <QueryLoader query={photosQuery}>
        {(loadedQuery) => (
          <div className="flex flex-col gap-5">
            <PhotoSort />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loadedQuery.data.map((photo) => (
                <PhotoDetailsDialog key={photo.id} photo={photo} />
              ))}
            </div>
            <PhotoPagination
              currentPage={loadedQuery.page + 1}
              totalPhotos={loadedQuery.total}
            />
          </div>
        )}
      </QueryLoader>
    </div>
  );
}

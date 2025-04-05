import { useFetchPhotos } from "@/features/queries";

import { PhotoDetailsDialog } from "./PhotoDetailsDialog";
import { QueryLoader } from "./QueryLoader";

export function PhotoList() {
  const photosQuery = useFetchPhotos({
    sort: "name",
    page: 1,
    limit: 10,
  });

  return (
    <div className="mx-auto p-10">
      <QueryLoader query={photosQuery}>
        {(loadedQuery) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadedQuery.data.map((photo) => (
              <PhotoDetailsDialog key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </QueryLoader>
    </div>
  );
}

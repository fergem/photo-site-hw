import { atomWithStorage } from "jotai/utils";

import { PhotosQuery } from "./models";

export const photosQueryAtom = atomWithStorage<PhotosQuery>("bearer", {
  sort: "name",
  page: 0,
  limit: 10,
});

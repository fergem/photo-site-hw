import { atomWithStorage } from "jotai/utils";

import { PhotosQuery } from "./models";

export const photosQueryAtom = atomWithStorage<PhotosQuery>("photosQuery", {
  sort: "name",
  page: 0,
  limit: 10,
});

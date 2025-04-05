import { atomWithStorage } from "jotai/utils";

export const bearerAtom = atomWithStorage<string | undefined>(
  "bearer",
  undefined
);

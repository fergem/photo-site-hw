import { atomWithStorage } from "jotai/utils";

import { LoginResponse } from "./models";

export const bearerAtom = atomWithStorage<LoginResponse | undefined>(
  "bearer",
  undefined
);

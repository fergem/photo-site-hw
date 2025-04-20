import { useSetAtom } from "jotai";

import { bearerAtom } from "@/features/bearerAtom";

import { Button } from "./ui/button";

export function LogoutButton() {
  const setBearer = useSetAtom(bearerAtom);

  const handleLogout = () => {
    setBearer(undefined);
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

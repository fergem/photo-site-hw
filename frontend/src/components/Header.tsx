import { useAtomValue } from "jotai";
import { Camera } from "lucide-react";

import { bearerAtom } from "@/features/bearerAtom";

import { LogoutButton } from "./LogoutButton";
import { SignUpLoginDialog } from "./SignUpLoginDialog";
import { SubscribeButton } from "./SubsrcibeButton";

export function Header() {
  const bearer = useAtomValue(bearerAtom);
  const bearerPresent = !!bearer;

  return (
    <header className="bg-background flex flex-row items-center h-16 px-30 gap-2 justify-between shadow-md">
      <div className="flex flex-row items-center gap-3">
        <Camera className="mt-1" size={40} />
        <h1 className="text-2xl">Photo album</h1>
      </div>

      <nav className="flex items-center justify-end gap-2">
        <SubscribeButton />

        {bearerPresent ? <LogoutButton /> : <SignUpLoginDialog />}
      </nav>
    </header>
  );
}

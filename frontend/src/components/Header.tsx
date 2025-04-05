import { Camera } from "lucide-react";

import { LoginDialog } from "./LoginDialog";
import { SignUpDialog } from "./SignUpDialog";

export function Header() {
  return (
    <header className="bg-accent flex flex-row items-center h-16 px-30 gap-2">
      <h1 className="text-2xl">Photo album</h1>
      <Camera className="mt-1" size={30} />
      <nav className="flex flex-1 items-center justify-end gap-2">
        <SignUpDialog />
        <LoginDialog />
      </nav>
    </header>
  );
}

import { Loader } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 -ml-[50%]">
      <Loader />
    </div>
  );
}

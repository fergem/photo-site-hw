import { UseQueryResult } from "@tanstack/react-query";
import { Frown } from "lucide-react";

import { LoadingPage } from "./LoadingPage";
import { Button } from "./ui/button";

interface IQueryLoaderProps<T> {
  query: UseQueryResult<T>;
  emptyElement?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function QueryLoader<T>({
  query,
  emptyElement,
  children,
}: IQueryLoaderProps<T>) {
  if (query.isLoading) {
    return (
      <div className="not-prose flex relative flex-1 w-full content-center">
        <LoadingPage />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="not-prose my-4 flex size-full flex-col items-center justify-center gap-2 prose">
        <Frown size="120" />
        <h2 className="prose-h2:mb-1 prose-h2:mt-0">Error</h2>
        <Button onClick={() => void query.refetch()}>Retry</Button>
      </div>
    );
  }

  if (!query.data) {
    return <>{emptyElement}</>;
  }

  return <>{children(query.data)}</>;
}

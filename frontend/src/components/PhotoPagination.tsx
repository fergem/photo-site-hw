import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";

import { photosQueryAtom } from "@/features/photosQueryAtom";
import { cn } from "@/lib/utils";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PhotoPaginationProps {
  totalPhotos: number;
  currentPage: number;
}

export function PhotoPagination({
  totalPhotos,
  currentPage,
}: PhotoPaginationProps) {
  const [photosQuery, setPhotosQuery] = useAtom(photosQueryAtom);
  const [inputValue, setInputValue] = useState(photosQuery.limit);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setInputValue(value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue > 100) {
        setPhotosQuery((prev) => ({
          ...prev,
          limit: 100,
        }));
        setInputValue(100);
      }

      if (inputValue < 1) {
        setPhotosQuery((prev) => ({
          ...prev,
          limit: 1,
        }));
        setInputValue(1);
      }

      if (inputValue >= 1 && inputValue <= 100) {
        setPhotosQuery((prev) => ({
          ...prev,
          limit: inputValue,
        }));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue, setPhotosQuery]);

  const decrementPage = () => {
    if (currentPage > 0) {
      setPhotosQuery((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  const incrementPage = () => {
    if (currentPage < totalPhotos) {
      setPhotosQuery((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const totalPages = Math.ceil(totalPhotos / photosQuery.limit);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(currentPage == 1 && "opacity-50 cursor-default")}
            onClick={currentPage != 1 ? decrementPage : undefined}
          />
        </PaginationItem>
        {currentPage != 1 && (
          <PaginationItem>
            <PaginationLink onClick={decrementPage}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {currentPage != totalPages && (
          <PaginationItem>
            <PaginationLink onClick={incrementPage}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage == totalPages && "opacity-50 cursor-default"
            )}
            onClick={currentPage != totalPages ? incrementPage : undefined}
          />
        </PaginationItem>

        <Input
          className="w-20 mr-2"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Label>of {totalPhotos} photos</Label>
      </PaginationContent>
    </Pagination>
  );
}

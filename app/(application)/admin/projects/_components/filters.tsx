"use client";

import { useCallback, useEffect, useState, useId } from "react";

import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";

import * as Input from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

import { StatusFilter } from "./filters/status-filter";
import { TypeFilter } from "./filters/type-filter";

export function Filters() {
  const t = useTranslations("admin.exercises.projects.filters");
  const id = useId();
  const trpc = useTRPC();

  // Query parameters
  const [search, setSearch] = useQueryState("search");
  const [status, setStatus] = useQueryState("status");
  const [type, setType] = useQueryState("type");

  // Reset page number when filters change
  const [, setPage] = useQueryState("page");
  useEffect(() => {
    setPage("1");
  }, [search, status, type, setPage]);

  // Local state for debounced search
  const [inputValue, setInputValue] = useState(search || "");
  const [debouncedValue, setDebouncedValue] = useDebounceValue(
    inputValue,
    300
  );

  // Effect to update search when debounced value changes
  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearch(null);
    setInputValue("");
    setDebouncedValue("");
  }, [setSearch, setDebouncedValue]);

  // Handle filter changes
  const handleStatusChange = useCallback(
    (value: string) => {
      setStatus(value);
    },
    [setStatus]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
    },
    [setType]
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:w-80">
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                id={`${id}-search`}
                placeholder={t("searchPlaceholder")}
                value={inputValue}
                onChange={handleSearchChange}
              />
              {inputValue && (
                <Input.Icon
                  as={RiCloseLine}
                  className="cursor-pointer hover:text-text-strong-950"
                  onClick={clearSearch}
                />
              )}
            </Input.Wrapper>
          </Input.Root>
        </div>

        <StatusFilter value={status || "all"} onValueChange={handleStatusChange} />
        <TypeFilter value={type || "all"} onValueChange={handleTypeChange} />
      </div>
    </div>
  );
} 
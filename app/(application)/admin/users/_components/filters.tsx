"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

import { RoleFilter } from "@/app/(application)/admin/users/_components/filters/role-filter";
import { StatusFilter } from "@/app/(application)/admin/users/_components/filters/status-filter";
import { adminUsersParsers } from "@/app/(application)/admin/users/searchParams";
import { ClearFiltersButton } from "@/components/custom/table/clear-filters-button";
import { SearchInput } from "@/components/custom/table/search";
import { PAGES } from "@/constants/pages";

const waitlistStatusSchema = z.union([
    z.literal("approved"),
    z.literal("pending"),
    z.literal("rejected"),
    z.literal("all"),
]);

const roleSchema = z.union([
    z.literal("admin"),
    z.literal("user"),
    z.literal("all"),
    z.literal(""),
]);

export function Filters() {
    const router = useRouter();
    // Query state
    const [search, setSearch] = useQueryState(
        "search",
        adminUsersParsers.search
    );
    const [waitlistStatus, setWaitlistStatus] = useQueryState(
        "waitlistStatus",
        adminUsersParsers.waitlistStatus
    );
    const [role, setRole] = useQueryState("role", adminUsersParsers.role);

    // Local state
    const [inputValue, setInputValue] = useState(search || "");
    const [debouncedValue, setDebouncedValue] = useDebounceValue(
        inputValue,
        300
    );

    // Translations
    const commonT = useTranslations("common");

    // Derived state
    const isSearching = useMemo(() => {
        return inputValue !== debouncedValue;
    }, [inputValue, debouncedValue]);

    const hasActiveFilters = useMemo(() => {
        return !!(
            search ||
            (waitlistStatus && waitlistStatus !== "all") ||
            (role && role !== "all")
        );
    }, [search, waitlistStatus, role]);

    // Effects
    useEffect(() => {
        setSearch(debouncedValue);
    }, [debouncedValue, setSearch]);

    // Handlers
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

    const clearSearch = useCallback(() => {
        setSearch(null);
        setInputValue("");
        setDebouncedValue("");
    }, [setSearch, setDebouncedValue]);

    const handleWaitlistStatusChange = useCallback(
        (value: string) => {
            const parsedValue = waitlistStatusSchema.safeParse(value);
            if (parsedValue.success) {
                setWaitlistStatus(parsedValue.data);
            }
        },
        [setWaitlistStatus]
    );

    const handleRoleChange = useCallback(
        (value: string) => {
            const parsedValue = roleSchema.safeParse(value);
            if (parsedValue.success) {
                if (parsedValue.data === "" || parsedValue.data === "all") {
                    setRole(null);
                } else {
                    setRole(parsedValue.data);
                }
            }
        },
        [setRole]
    );

    const clearAllFilters = useCallback(() => {
        setInputValue("");
        router.push(PAGES.ADMIN_USERS);
    }, [router]);

    return (
        <>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
                <SearchInput
                    value={inputValue}
                    isSearching={isSearching}
                    placeholder={commonT("search")}
                    onChange={handleInputChange}
                    onClear={clearSearch}
                    className="lg:hidden"
                />

                <div className="hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex">
                    <SearchInput
                        value={inputValue}
                        isSearching={isSearching}
                        placeholder={commonT("search")}
                        onChange={handleInputChange}
                        onClear={clearSearch}
                        className="w-[300px]"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <ClearFiltersButton
                        onClick={clearAllFilters}
                        disabled={!hasActiveFilters}
                    />

                    <StatusFilter
                        value={waitlistStatus}
                        onValueChange={handleWaitlistStatusChange}
                    />

                    <RoleFilter value={role} onValueChange={handleRoleChange} />
                </div>
            </div>
        </>
    );
}

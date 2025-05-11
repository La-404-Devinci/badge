"use client";

import { useCallback, useEffect, useId, useState } from "react";

import {
    RiAddFill,
    RiCloseLine,
    RiMagicFill,
    RiSearchLine,
} from "@remixicon/react";
import { keepPreviousData } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";

import { useExerciceTableActions } from "../_hooks/use-exercice-table-actions";
import { adminExercicesParsers } from "../searchParams";

type StatusType = "draft" | "published" | "archived" | "unarchived";
type DifficultyType = "easy" | "medium" | "hard" | "unknown" | "all";

export function Filters() {
    const t = useTranslations("admin.exercices");
    const id = useId();
    const trpc = useTRPC();

    // Query parameters
    const [search, setSearch] = useQueryState(
        "search",
        adminExercicesParsers.search
    );
    const [status, setStatus] = useQueryState(
        "status",
        adminExercicesParsers.status
    );
    const [difficulty, setDifficulty] = useQueryState(
        "difficulty",
        adminExercicesParsers.difficulty
    );

    // Reset page number when filters change
    const [, setPage] = useQueryState("page", adminExercicesParsers.page);
    useEffect(() => {
        setPage(1);
    }, [search, status, difficulty, setPage]);

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

    // List generate queue
    const { data: generateQueue, refetch: refetchGenerateQueue } = useQuery(
        trpc.exercice.listGenerateQueue.queryOptions(undefined, {
            placeholderData: keepPreviousData,
            refetchInterval: 10000,
        })
    );

    // Handle generate exercice
    const { generateExercice } = useExerciceTableActions();

    const handleGenerateExercice = useCallback(async () => {
        await generateExercice();
        await refetchGenerateQueue();
    }, [generateExercice, refetchGenerateQueue]);

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full md:max-w-xs">
                    <Label.Root htmlFor={`${id}-search`}>
                        {t("filters.search")}
                    </Label.Root>
                    <Input.Root>
                        <Input.Wrapper>
                            <Input.Icon as={RiSearchLine} />
                            <Input.Input
                                id={`${id}-search`}
                                placeholder={t("filters.searchPlaceholder")}
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

                <div className="w-full md:max-w-[180px]">
                    <Label.Root htmlFor={`${id}-status`}>
                        {t("filters.status")}
                    </Label.Root>
                    <Select.Root
                        value={status || undefined}
                        onValueChange={(value: StatusType) => setStatus(value)}
                    >
                        <Select.Trigger id={`${id}-status`}>
                            <Select.Value
                                placeholder={t("filters.statusPlaceholder")}
                            />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="unarchived">
                                {t("filters.unarchived")}
                            </Select.Item>
                            <Select.Item value="draft">
                                {t("filters.draft")}
                            </Select.Item>
                            <Select.Item value="published">
                                {t("filters.published")}
                            </Select.Item>
                            <Select.Item value="archived">
                                {t("filters.archived")}
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>

                <div className="w-full md:max-w-[180px]">
                    <Label.Root htmlFor={`${id}-difficulty`}>
                        {t("filters.difficulty")}
                    </Label.Root>
                    <Select.Root
                        value={difficulty || undefined}
                        onValueChange={(value: DifficultyType) =>
                            setDifficulty(value)
                        }
                    >
                        <Select.Trigger id={`${id}-difficulty`}>
                            <Select.Value
                                placeholder={t("filters.difficultyPlaceholder")}
                            />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="all">
                                {t("filters.all")}
                            </Select.Item>
                            <Select.Item value="easy">
                                {t("filters.easy")}
                            </Select.Item>
                            <Select.Item value="medium">
                                {t("filters.medium")}
                            </Select.Item>
                            <Select.Item value="hard">
                                {t("filters.hard")}
                            </Select.Item>
                            <Select.Item value="unknown">
                                {t("filters.unknown")}
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                <Tooltip.Provider>
                    <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                            <div>
                                <Button.Root
                                    variant="neutral"
                                    mode="stroke"
                                    size="small"
                                    onClick={handleGenerateExercice}
                                    disabled={
                                        (generateQueue?.runs.length ?? 0) >= 5
                                    }
                                >
                                    {(generateQueue?.runs.length ?? 0) >= 5 ? (
                                        <>
                                            <StaggeredFadeLoader className="h-4 w-4" />
                                            <span>
                                                {t("actions.generating")}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Button.Icon as={RiMagicFill} />
                                            <span>{t("actions.generate")}</span>
                                        </>
                                    )}
                                </Button.Root>
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <p>
                                {t("actions.generatingInProgress", {
                                    count: generateQueue?.runs.length ?? 0,
                                })}
                            </p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                </Tooltip.Provider>
                <Button.Root
                    variant="primary"
                    mode="filled"
                    size="small"
                    disabled
                >
                    <Button.Icon as={RiAddFill} />
                    {t("actions.create")}
                </Button.Root>
            </div>
        </div>
    );
}

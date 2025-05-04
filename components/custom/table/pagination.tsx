"use client";

import {
    RiArrowLeftDoubleLine,
    RiArrowLeftSLine,
    RiArrowRightDoubleLine,
    RiArrowRightSLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Pagination from "@/components/ui/pagination";
import * as Select from "@/components/ui/select";

// Define type for pagination data
export interface PaginationData {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface TablePaginationProps {
    pagination: PaginationData;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    itemName?: string;
}

export function TablePagination({
    pagination,
    page,
    limit,
    onPageChange,
    onLimitChange,
    itemName,
}: TablePaginationProps) {
    // Initialize translations
    const t = useTranslations("common.pagination");

    const currentPage = page;
    const currentLimit = limit;
    const itemLabel = itemName || t("items");

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            onPageChange(currentPage + 1);
        }
    };

    // Handle limit change
    const handleLimitChange = (value: string) => {
        onLimitChange(parseInt(value));
        onPageChange(1); // Reset to first page when changing items per page
    };

    return (
        <div className="mt-auto">
            {/* Mobile pagination */}
            <div className="mt-4 flex items-center justify-between py-4 lg:hidden">
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    size="xsmall"
                    className="w-28"
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPreviousPage}
                >
                    {t("previous")}
                </Button.Root>
                <span className="whitespace-nowrap text-center text-paragraph-sm text-text-sub-600">
                    {t("page")} {currentPage} {t("of")}{" "}
                    {Math.ceil(pagination.total / currentLimit)}
                </span>
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    size="xsmall"
                    className="w-28"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                >
                    {t("next")}
                </Button.Root>
            </div>

            {/* Desktop pagination */}
            <div className="mt-10 hidden items-center gap-3 lg:flex">
                <span className="flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600">
                    {t("showing")}{" "}
                    {currentPage * currentLimit - currentLimit + 1} {t("to")}{" "}
                    {Math.min(currentPage * currentLimit, pagination.total)}{" "}
                    {t("of")} {pagination.total} {itemLabel}
                </span>

                <Pagination.Root>
                    <Pagination.NavButton
                        onClick={() => onPageChange(1)}
                        disabled={!pagination.hasPreviousPage}
                    >
                        <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
                    </Pagination.NavButton>
                    <Pagination.NavButton
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPreviousPage}
                    >
                        <Pagination.NavIcon as={RiArrowLeftSLine} />
                    </Pagination.NavButton>

                    {/* Page number 1 */}
                    <Pagination.Item
                        current={currentPage === 1}
                        onClick={() => onPageChange(1)}
                    >
                        {"1"}
                    </Pagination.Item>

                    {/* First ellipsis */}
                    {pagination.totalPages > 3 && currentPage > 3 && (
                        <Pagination.Item disabled>{"..."}</Pagination.Item>
                    )}

                    {/* Generate page numbers */}
                    {Array.from({
                        length: pagination.totalPages || 0,
                    }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        // Skip first and last pages (handled separately)
                        if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages
                        ) {
                            return null;
                        }

                        // Show current page and 1 page before/after
                        const shouldShow =
                            pageNumber === currentPage - 1 ||
                            pageNumber === currentPage ||
                            pageNumber === currentPage + 1;

                        // Only show if within range to display
                        if (!shouldShow) {
                            return null;
                        }

                        return (
                            <Pagination.Item
                                key={pageNumber}
                                current={pageNumber === currentPage}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </Pagination.Item>
                        );
                    })}

                    {/* Last ellipsis */}
                    {pagination.totalPages > 3 &&
                        currentPage < pagination.totalPages - 2 && (
                            <Pagination.Item disabled>{"..."}</Pagination.Item>
                        )}

                    {/* Last page number */}
                    {pagination.totalPages > 1 && (
                        <Pagination.Item
                            current={currentPage === pagination.totalPages}
                            onClick={() => onPageChange(pagination.totalPages)}
                        >
                            {pagination.totalPages}
                        </Pagination.Item>
                    )}

                    <Pagination.NavButton
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                    >
                        <Pagination.NavIcon as={RiArrowRightSLine} />
                    </Pagination.NavButton>
                    <Pagination.NavButton
                        onClick={() => onPageChange(pagination.totalPages)}
                        disabled={!pagination.hasNextPage}
                    >
                        <Pagination.NavIcon as={RiArrowRightDoubleLine} />
                    </Pagination.NavButton>
                </Pagination.Root>

                <div className="flex flex-1 justify-end">
                    <Select.Root
                        size="xsmall"
                        value={String(currentLimit)}
                        onValueChange={handleLimitChange}
                    >
                        <Select.Trigger className="w-auto">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="10">{"10 /page"}</Select.Item>
                            <Select.Item value="25">{"25 /page"}</Select.Item>
                            <Select.Item value="50">{"50 /page"}</Select.Item>
                            <Select.Item value="100">{"100 /page"}</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>
        </div>
    );
}

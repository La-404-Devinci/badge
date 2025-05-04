"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";

import { motion } from "motion/react";

import * as Table from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

interface TableLoadingSkeletonProps extends ComponentPropsWithoutRef<"div"> {
    columnLength: number;
}

const TableLoadingSkeleton = forwardRef<
    HTMLDivElement,
    TableLoadingSkeletonProps
>(({ className, columnLength, ...props }, ref) => {
    return (
        <Table.Row>
            <Table.Cell
                colSpan={columnLength}
                className="text-center group-hover/row:bg-transparent px-1 py-2"
            >
                <div
                    ref={ref}
                    className={cn(
                        "flex flex-col items-start gap-3 w-full",
                        className
                    )}
                    {...props}
                >
                    <motion.div
                        className="h-6 rounded relative overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/80 dark:via-neutral-600/80 to-transparent animate-shimmer"
                            style={{ backgroundSize: "200% 100%" }}
                        ></div>
                    </motion.div>
                    <motion.div
                        className="h-6 rounded relative overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/80 dark:via-neutral-600/80 to-transparent animate-shimmer"
                            style={{ backgroundSize: "200% 100%" }}
                        ></div>
                    </motion.div>
                    <motion.div
                        className="h-6 rounded relative overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/80 dark:via-neutral-600/80 to-transparent animate-shimmer"
                            style={{ backgroundSize: "200% 100%" }}
                        ></div>
                    </motion.div>
                </div>
            </Table.Cell>
        </Table.Row>
    );
});

TableLoadingSkeleton.displayName = "TableLoadingSkeleton";

export { TableLoadingSkeleton };

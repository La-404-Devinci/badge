"use client";

import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface TableEmptyStateProps extends ComponentPropsWithoutRef<"div"> {
    icon?: ReactNode;
    title?: string;
    description?: string;
}

const TableEmptyState = forwardRef<HTMLDivElement, TableEmptyStateProps>(
    ({ className, icon, title, description, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col items-center gap-5 p-5",
                    className
                )}
                {...props}
            >
                {icon && <div className="size-[108px]">{icon}</div>}
                {(title || description) && (
                    <div className="text-center text-paragraph-sm text-text-soft-400">
                        {title && <>{title}</>}
                        {title && description && <br />}
                        {description && <>{description}</>}
                    </div>
                )}
                {children}
            </div>
        );
    }
);

TableEmptyState.displayName = "TableEmptyState";

export { TableEmptyState };

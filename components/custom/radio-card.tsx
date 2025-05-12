"use client";

import { forwardRef } from "react";

import * as Radio from "@/components/ui/radio";
import { cn } from "@/lib/utils";

type RadioCardProps = {
    value: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    selected: boolean;
    className?: string;
};

export const RadioCard = forwardRef<HTMLDivElement, RadioCardProps>(
    ({ value, title, description, icon, selected, className }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border border-bg-soft-200 p-4 transition-all duration-200",
                    selected && "border-primary-base bg-primary-50/10",
                    "hover:border-primary-base hover:bg-primary-50/5",
                    className
                )}
            >
                {icon && (
                    <div className="flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div className="flex-1">
                    <div className="font-medium text-static-black">{title}</div>
                    {description && (
                        <div className="text-sm text-static-black/70">
                            {description}
                        </div>
                    )}
                </div>
                <Radio.Item value={value} id={value} />
            </div>
        );
    }
);
RadioCard.displayName = "RadioCard";

type RadioCardGroupProps = {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    name?: string;
    className?: string;
};

export function RadioCardGroup({
    children,
    value,
    onValueChange,
    defaultValue,
    name,
    className,
}: RadioCardGroupProps) {
    return (
        <Radio.Group
            value={value}
            onValueChange={onValueChange}
            defaultValue={defaultValue}
            name={name}
            className={cn("flex flex-col gap-3", className)}
        >
            {children}
        </Radio.Group>
    );
}

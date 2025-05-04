import * as React from "react";

import * as Button from "@/components/ui/button";
import * as Kbd from "@/components/ui/kbd";
import { cn } from "@/lib/utils/cn";

export interface IslandButtonBaseProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button label
     */
    label: string;
    /**
     * Optional custom className
     */
    className?: string;
}

export interface IslandKbdButtonProps extends IslandButtonBaseProps {
    /**
     * Keyboard shortcut key to display
     */
    shortcut: string;
}

export function IslandKbdButton({
    label,
    shortcut,
    className,
    onClick,
    ...props
}: IslandKbdButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 rounded px-1.5 py-1",
                "text-label-sm font-medium text-text-sub-600",
                "transition-all duration-200 ease-in-out",
                "hover:bg-bg-weak-100 hover:text-text-strong-950 hover:shadow-sm",
                "active:bg-bg-weak-200",
                "whitespace-nowrap",
                className
            )}
            {...props}
        >
            {label} <Kbd.Root className="ml-1">{shortcut}</Kbd.Root>
        </button>
    );
}

IslandKbdButton.displayName = "IslandKbdButton";

export interface IslandIconButtonProps extends IslandButtonBaseProps {
    /**
     * Icon component to display
     */
    icon: React.ElementType;
}

export function IslandIconButton({
    label,
    icon,
    className,
    onClick,
    ...props
}: IslandIconButtonProps) {
    return (
        <Button.Root
            variant="neutral"
            mode="stroke"
            size="xsmall"
            onClick={onClick}
            className={cn(
                "hover:bg-bg-soft-200 hover:border-stroke-sub-300 whitespace-nowrap",
                className
            )}
            {...props}
        >
            <Button.Icon as={icon} />
            {label}
        </Button.Root>
    );
}

IslandIconButton.displayName = "IslandIconButton";

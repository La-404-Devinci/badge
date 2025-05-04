"use client";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { RiCloseLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IslandDeselectProps extends ComponentPropsWithoutRef<"button"> {
    /**
     * Callback function to handle deselect all action
     */
    onDeselect: () => void;
    /**
     * Optional tooltip text
     * @default "Deselect all"
     */
    tooltipText?: string;
}

const IslandDeselect = forwardRef<HTMLButtonElement, IslandDeselectProps>(
    (
        { className, onDeselect, tooltipText = "Deselect all", ...props },
        ref
    ) => {
        return (
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button.Root
                        ref={ref}
                        size="xsmall"
                        variant="neutral"
                        mode="ghost"
                        onClick={onDeselect}
                        className={cn(className)}
                        {...props}
                    >
                        <Button.Icon as={RiCloseLine} />
                    </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>{tooltipText}</Tooltip.Content>
            </Tooltip.Root>
        );
    }
);

IslandDeselect.displayName = "IslandDeselect";

export { IslandDeselect };

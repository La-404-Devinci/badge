import * as React from "react";

import { VerticalDivider } from "@/components/custom/vertical-divider";
import { cn } from "@/lib/utils/cn";

export interface IslandDividerProps {
    /**
     * Optional custom className
     */
    className?: string;
}

export function IslandDivider({ className }: IslandDividerProps) {
    return <VerticalDivider className={cn("h-5", className)} />;
}

IslandDivider.displayName = "IslandDivider";

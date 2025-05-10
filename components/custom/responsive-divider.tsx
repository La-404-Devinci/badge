import * as Divider from "@/components/ui/divider";
import { cn } from "@/lib/utils";

interface ResponsiveDividerProps {
    className?: string;
}

export default function ResponsiveDivider({
    className,
}: ResponsiveDividerProps) {
    return (
        <>
            <Divider.Root className={"my-2 md:hidden"} variant="dotted-line" />
            <div
                role="separator"
                className={cn(
                    "hidden md:flex self-stretch",
                    "relative w-1 h-auto",
                    "text-stroke-soft-200 ![background-image:linear-gradient(0deg,currentColor_4px,transparent_4px)]",
                    "![background-position:50%_50%] ![background-size:1px_8px] ![background-repeat:repeat-y]",
                    className
                )}
            />
        </>
    );
}

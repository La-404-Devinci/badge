import { cn } from "@/lib/utils";

export default function HeaderStep({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex flex-col items-center gap-2">
                {/* icon */}
                <div
                    className={cn(
                        "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-20",
                        // bg
                        "before:absolute before:inset-0 before:rounded-full",
                        "before:bg-gradient-to-b before:from-primary-base before:to-transparent before:opacity-10"
                    )}
                >
                    <div
                        className="relative z-10 flex size-12 items-center justify-center rounded-full --bg-white-0 ring-1 ring-inset ring-stroke-soft-200 lg:size-14"
                        style={{
                            boxShadow:
                                "0 0 0 1px rgba(183, 83, 16, 0.04), 0 1px 1px 0.5px rgba(183, 83, 16, 0.04), 0 3px 3px -1.5px rgba(183, 83, 16, 0.02), 0 6px 6px -3px rgba(183, 83, 16, 0.04), 0 12px 12px -6px rgba(183, 83, 16, 0.04), 0px 24px 24px -12px rgba(183, 83, 16, 0.04), 0px 48px 48px -24px rgba(183, 83, 16, 0.04), inset 0px -1px 1px -0.5px rgba(183, 83, 16, 0.06)",
                        }}
                    >
                        {icon}
                    </div>
                </div>

                <div className="space-y-1 text-center">
                    <div className="font-inter-var text-title-h6 lg:text-title-h5">
                        {title}
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600 lg:text-paragraph-md">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

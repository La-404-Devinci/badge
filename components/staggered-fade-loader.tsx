import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { motion } from "motion/react";

import { tv, type VariantProps } from "@/lib/utils/tv";

const staggeredFadeLoaderVariants = tv({
    slots: {
        root: [
            // base
            "flex items-center justify-center",
            "transition duration-200 ease-out",
        ],
        dot: [
            // base
            "size-1 rounded-full shrink-0",
            "transition duration-200 ease-out",
        ],
    },
    variants: {
        variant: {
            light: {
                dot: "bg-bg-white-0",
            },
            dark: {
                dot: "bg-bg-strong-950",
            },
            muted: {
                dot: "bg-text-sub-600",
            },
        },
        spacing: {
            default: {
                root: "gap-1",
            },
            tight: {
                root: "gap-0.5",
            },
            loose: {
                root: "gap-2",
            },
        },
        size: {
            small: {
                dot: "size-0.5",
            },
            default: {
                dot: "size-1",
            },
            large: {
                dot: "size-1.5",
            },
        },
    },
    defaultVariants: {
        variant: "dark",
        spacing: "default",
        size: "default",
    },
});

const circleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

interface StaggeredFadeLoaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof staggeredFadeLoaderVariants> {
    asChild?: boolean;
}

export function StaggeredFadeLoader({
    className,
    variant,
    spacing,
    size,
    asChild,
    ...props
}: StaggeredFadeLoaderProps) {
    const Component = asChild ? Slot : "div";
    const { root, dot } = staggeredFadeLoaderVariants({
        variant,
        spacing,
        size,
    });

    return (
        <Component className={root({ class: className })} {...props}>
            {[...Array(3)].map((_, index) => (
                <motion.div
                    key={index}
                    className={dot()}
                    variants={circleVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            ))}
        </Component>
    );
}

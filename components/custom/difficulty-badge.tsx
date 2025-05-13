"use client";

import { useTranslations } from "next-intl";

import * as Badge from "@/components/ui/badge";

type DifficultyBadgeProps = React.ComponentProps<typeof Badge.Root> & {
    difficulty: string;
};

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "easy":
            return "green";
        case "medium":
            return "yellow";
        case "hard":
            return "red";
        default:
            return "gray";
    }
};

export default function DifficultyBadge({
    difficulty,
    ...props
}: DifficultyBadgeProps) {
    const t = useTranslations("dashboard.dailyChallenge");
    const color = getDifficultyColor(difficulty);

    return (
        <Badge.Root color={color} {...props}>
            {t(`difficulty.${difficulty}`)}
        </Badge.Root>
    );
}

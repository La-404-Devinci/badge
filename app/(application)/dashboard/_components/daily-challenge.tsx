"use client";

import { RiArrowRightLine } from "@remixicon/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";

import DifficultyBadge from "@/components/custom/difficulty-badge";
import * as Button from "@/components/ui/button";
import { PAGES } from "@/constants/pages";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export default function DailyChallenge() {
    const t = useTranslations("dashboard.dailyChallenge");
    const trpc = useTRPC();

    const { data: dailyChallenge } = useSuspenseQuery(
        trpc.exercice.getChallenge.queryOptions({ id: "daily" })
    );

    return (
        <div
            className={cn(
                "relative rounded-10 p-6 py-5",
                "bg-primary-base text-static-white shadow-fancy-buttons-primary",

                // Before
                "before:absolute before:inset-0 before:z-10 before:pointer-events-none before:rounded-[inherit]",
                "before:bg-gradient-to-b before:p-px before:from-static-white/[.12] before:to-transparent",
                "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",

                // After
                "after:absolute after:inset-0 after:rounded-[inherit]",
                "after:bg-gradient-to-b after:from-static-white after:to-transparent after:pointer-events-none after:opacity-[.16]"
            )}
        >
            <h2 className="font-bold">{t("title")}</h2>
            <p className="text-paragraph-xs mb-4">{t("description")}</p>

            <div
                className={cn(
                    "flex gap-2 h-40 w-full bg-white text-black rounded-lg p-4",
                    dailyChallenge ? "flex-col" : "items-center justify-center"
                )}
            >
                {dailyChallenge ? (
                    <>
                        <div className="flex flex-col gap-0.5">
                            <DifficultyBadge
                                size="small"
                                difficulty={dailyChallenge.difficulty ?? ""}
                                variant="lighter"
                                className="w-fit mb-1"
                            />

                            <h3 className="text-paragraph-sm font-bold">
                                {dailyChallenge.title}
                            </h3>

                            <p className="text-paragraph-xs max-h-8 overflow-hidden text-ellipsis">
                                {dailyChallenge.description}
                            </p>
                        </div>

                        <Button.Root
                            variant="neutral"
                            size="small"
                            className="ms-auto mt-auto"
                            asChild
                        >
                            <Link href={PAGES.DAILY_CHALLENGE}>
                                {t("startChallenge")}
                                <Button.Icon as={RiArrowRightLine} />
                            </Link>
                        </Button.Root>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <h3 className="text-paragraph-sm font-bold">
                            {t("noChallenge")}
                        </h3>
                        <p className="text-paragraph-xs">
                            {t("noChallengeDescription")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

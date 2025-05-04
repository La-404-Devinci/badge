"use client";

import { RiCloseLine, RiUserStarLine } from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import * as Banner from "@/components/ui/banner";
import * as LinkButton from "@/components/ui/link-button";

import { stopImpersonating } from "../_lib/stop-impersonating";

interface ImpersonationBannerProps {
    impersonatedUser: User;
}

export function ImpersonationBanner({
    impersonatedUser,
}: ImpersonationBannerProps) {
    const t = useTranslations("components.impersonationBanner");
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleStopImpersonation = () => {
        stopImpersonating(queryClient, router);
    };

    return (
        <Banner.Root
            variant="filled"
            status="warning"
            className="sticky top-0 z-50 w-full rounded-none"
        >
            <Banner.Content>
                <Banner.Icon as={RiUserStarLine} />
                <span className="text-label-sm">
                    {t("message", { userName: impersonatedUser.name })}
                </span>
                <LinkButton.Root
                    variant="modifiable"
                    size="medium"
                    underline
                    onClick={handleStopImpersonation}
                    className="ml-auto"
                >
                    {t("stopImpersonation")}
                </LinkButton.Root>
            </Banner.Content>
            <Banner.CloseButton onClick={handleStopImpersonation}>
                <RiCloseLine className="size-5" />
            </Banner.CloseButton>
        </Banner.Root>
    );
}

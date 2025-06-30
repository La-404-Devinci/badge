"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as SocialButton from "@/components/ui/social-button";
import * as SocialIcons from "@/components/ui/social-icons";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

type DiscordProvider = "discord";

export default function DiscordButton() {
    const t = useTranslations("auth");

    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (provider: DiscordProvider) => {
        setIsLoading(true);

        const res = await authClient.linkSocial({
            provider,
            callbackURL: PAGES.DASHBOARD,
        });
        setIsLoading(false);
        if (res.error) {
            console.error(res.error);
            return;
        }
    };

    const DProvider = {
        brand: "discord" as DiscordProvider,
        icon: SocialIcons.Discord,
    };
    return (
        <section className="flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8">
            <SocialButton.Root
                brand={DProvider.brand}
                mode="stroke"
                className="w-full"
                onClick={() => handleSignIn(DProvider.brand)}
                disabled={isLoading}
            >
                <SocialButton.Icon as={DProvider.icon} />
                {isLoading ? (
                    <>
                        <StaggeredFadeLoader variant="muted" />
                        {t("common.loading.signingIn")}
                    </>
                ) : (
                    t(`common.buttons.signInWith${DProvider.brand}`)
                )}
            </SocialButton.Root>
        </section>
    );
}

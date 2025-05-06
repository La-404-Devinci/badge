"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as SocialButton from "@/components/ui/social-button";
import * as SocialIcons from "@/components/ui/social-icons";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

type SocialProvider =
    | "github"
    | "apple"
    | "discord"
    | "facebook"
    | "google"
    | "twitter"
    | "dropbox"
    | "linkedin";

export function SignInForm() {
    const t = useTranslations("auth");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (provider: SocialProvider) => {
        setIsLoading(true);

        const res = await authClient.signIn.social({
            provider,
            newUserCallbackURL: PAGES.ONBOARDING,
            callbackURL: PAGES.DASHBOARD,
            errorCallbackURL: PAGES.SIGN_IN,
        });
        setIsLoading(false);
        if (res.error) {
            console.error(res.error);
            return;
        }
    };

    const providers: Array<{
        brand: SocialProvider;
        icon: React.ComponentType;
    }> = [
        {
            brand: "google",
            icon: SocialIcons.Google,
        },
        {
            brand: "discord",
            icon: SocialIcons.Discord,
        },
        {
            brand: "github",
            icon: SocialIcons.Github,
        },
    ];

    return (
        <div className="w-full max-w-[472px] px-4">
            <section className="flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8">
                {providers.map((provider) => (
                    <SocialButton.Root
                        key={provider.brand}
                        brand={provider.brand}
                        mode="stroke"
                        className="w-full"
                        onClick={() => handleSignIn(provider.brand)}
                        disabled={isLoading}
                    >
                        <SocialButton.Icon as={provider.icon} />
                        {isLoading ? (
                            <>
                                <StaggeredFadeLoader variant="muted" />
                                {t("common.loading.signingIn")}
                            </>
                        ) : (
                            t(`common.buttons.signInWith${provider.brand}`)
                        )}
                    </SocialButton.Root>
                ))}
            </section>
        </div>
    );
}

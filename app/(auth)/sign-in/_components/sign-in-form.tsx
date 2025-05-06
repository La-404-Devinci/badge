"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as SocialButton from "@/components/ui/social-button";
import * as SocialIcons from "@/components/ui/social-icons";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

export function SignInForm() {
    const t = useTranslations("auth");
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isDiscordLoading, setIsDiscordLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setIsGoogleLoading(true);

        authClient.signIn.social(
            {
                provider: "google",
                callbackURL: PAGES.DASHBOARD,
                errorCallbackURL: PAGES.SIGN_IN,
            },
            {
                onRequest() {
                    setIsGoogleLoading(true);
                },
                onSuccess() {
                    router.push(PAGES.DASHBOARD);
                },
                onError() {
                    setIsGoogleLoading(false);
                },
            }
        );
    };

    const handleDiscordSignIn = () => {
        setIsDiscordLoading(true);

        authClient.signIn.social(
            {
                provider: "discord",
                callbackURL: PAGES.DASHBOARD,
                errorCallbackURL: PAGES.SIGN_IN,
            },
            {
                onRequest() {
                    setIsDiscordLoading(true);
                },
                onSuccess() {
                    router.push(PAGES.DASHBOARD);
                },
                onError() {
                    setIsDiscordLoading(false);
                },
            }
        );
    };

    const handleGithubSignIn = () => {
        setIsGithubLoading(true);

        authClient.signIn.social(
            {
                provider: "github",
                callbackURL: PAGES.DASHBOARD,
                errorCallbackURL: PAGES.SIGN_IN,
            },
            {
                onRequest() {
                    setIsGithubLoading(true);
                },
                onSuccess() {
                    router.push(PAGES.DASHBOARD);
                },
                onError() {
                    setIsGithubLoading(false);
                },
            }
        );
    };

    return (
        <div className="w-full max-w-[472px] px-4">
            <section className="flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8">
                <SocialButton.Root
                    brand="google"
                    mode="stroke"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                >
                    <SocialButton.Icon as={SocialIcons.Google} />
                    {isGoogleLoading ? (
                        <>
                            <StaggeredFadeLoader variant="muted" />
                            {t("common.loading")}
                        </>
                    ) : (
                        t("common.buttons.signInWithGoogle")
                    )}
                </SocialButton.Root>
                <SocialButton.Root
                    brand="discord"
                    mode="stroke"
                    className="w-full"
                    onClick={handleDiscordSignIn}
                    disabled={isDiscordLoading}
                >
                    <SocialButton.Icon as={SocialIcons.Discord} />
                    {isDiscordLoading ? (
                        <>
                            <StaggeredFadeLoader variant="muted" />
                            {t("common.loading")}
                        </>
                    ) : (
                        t("common.buttons.signInWithDiscord")
                    )}
                </SocialButton.Root>
                <SocialButton.Root
                    brand="github"
                    mode="stroke"
                    className="w-full"
                    onClick={handleGithubSignIn}
                    disabled={isGithubLoading}
                >
                    <SocialButton.Icon as={SocialIcons.Github} />
                    {isGithubLoading ? (
                        <>
                            <StaggeredFadeLoader variant="muted" />
                            {t("common.loading")}
                        </>
                    ) : (
                        t("common.buttons.signInWithGithub")
                    )}
                </SocialButton.Root>
            </section>
        </div>
    );
}

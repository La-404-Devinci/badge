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
            </section>
        </div>
    );
}

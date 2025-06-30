"use client";

import * as React from "react";
import { useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslations } from "next-intl";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";
import * as SocialButton from "@/components/ui/social-button";
import * as SocialIcons from "@/components/ui/social-icons";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

import { useOnboardingStore } from "./store";

export function ConnexionModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useTranslations("auth");
    const [isLoading, setIsLoading] = useState(false);
    const { setOnboardingStore } = useOnboardingStore();
    const handleSignIn = async () => {
        setIsLoading(true);

        const res = await authClient.linkSocial({
            provider: "discord" as const,
            callbackURL: PAGES.ONBOARDING,
        });
        console.log("Connexion successful", res);
        setIsLoading(false);
        if (res.error) {
            console.error(res.error);
            return;
        }
        setOnboardingStore({
            role: true,
        });
    };

    return (
        <Modal.Root open={open} onOpenChange={onOpenChange}>
            <Modal.Content className="max-w-[440px]">
                <VisuallyHidden>
                    <Modal.Title>
                        {t("onboarding.connexionModal.title")}
                    </Modal.Title>
                </VisuallyHidden>
                <Modal.Body className="flex items-start gap-4">
                    <div className="space-y-1 flex flex-col gap-4 items-center justify-center w-full">
                        <div className="text-label-md text-text-strong-950">
                            {t("onboarding.connexionModal.title")}
                        </div>
                        <SocialButton.Root
                            brand={"discord"}
                            mode="stroke"
                            className="w-full"
                            onClick={handleSignIn}
                            disabled={isLoading}
                        >
                            <SocialButton.Icon as={SocialIcons.Discord} />
                            {isLoading ? (
                                <>
                                    <StaggeredFadeLoader variant="muted" />
                                    {t("common.loading.signingIn")}
                                </>
                            ) : (
                                t(`common.buttons.signInWithdiscord`)
                            )}
                        </SocialButton.Root>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            variant="neutral"
                            mode="stroke"
                            size="small"
                            className="w-full"
                        >
                            {t("common.buttons.cancel")}
                        </Button.Root>
                    </Modal.Close>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import { authClient } from "@/lib/auth/client";
import { PAGES } from "@/constants/pages";

type SocialProvider = "google" | "github" | "discord";

interface SocialConnectButtonProps {
  provider: SocialProvider;
  disabled?: boolean;
  className?: string;
}

export function SocialConnectButton({
  provider,
  disabled = false,
  className = ""
}: SocialConnectButtonProps) {
  const t = useTranslations("settings.account.linkAccount");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await authClient.linkSocial({
        provider: provider as const,
        callbackURL: PAGES.ACCOUNT_SETTINGS,
      });

      if (res.error) {
        console.error(`Erreur lors de la connexion avec ${provider}:`, res.error);
        return;
      }

      console.log(`Connexion avec ${provider} réussie`, res);
    } catch (error) {
      console.error(`Erreur lors de la connexion avec ${provider}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (provider) {
      case "google":
        return t("connectWithGoogle");
      case "github":
        return t("connectWithGitHub");
      case "discord":
        return t("connectWithDiscord");
      default:
        return `Connect with ${provider}`;
    }
  };

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="medium"
      onClick={handleConnect}
      disabled={disabled || isLoading}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <StaggeredFadeLoader variant="muted" />
          {t("common.loading.signingIn")}
        </>
      ) : (
        getButtonText()
      )}
    </Button.Root>
  );
} 
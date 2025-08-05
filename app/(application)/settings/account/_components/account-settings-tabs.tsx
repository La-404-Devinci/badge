"use client";

import { Suspense } from "react";

import {
    RiArrowRightSLine,
    RiGlobalLine,
    RiLink,
    RiPaletteLine,
    RiUser6Line,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { CursorLoader } from "@/components/ui/cursor-loader";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import * as TabMenuVertical from "@/components/ui/tab-menu-vertical";
import { useUserData } from "@/hooks/use-user-data";
import * as SocialButton from "@/components/ui/social-button";
import * as SocialIcons from "@/components/ui/social-icons";
import { authClient } from "@/lib/auth/client";
import { PAGES } from "@/constants/pages";

import Appearance from "./appearance";
import LanguageRegion from "./language-region";
import AccountSettings from "./my-account";

type SocialProvider =
    | "github"
    | "apple"
    | "discord"
    | "facebook"
    | "google"
    | "twitter"
    | "dropbox"
    | "linkedin";

// Composant pour "Lier un compte"
const LinkAccount = () => {
    const t = useTranslations("settings.account.linkAccountSettings");
    const { user } = useUserData();

    // Vérifier les comptes liés de l'utilisateur
    const linkedAccounts = user?.accounts || [];
    const hasDiscord = linkedAccounts.some(account => account.providerId === "discord");
    const hasGoogle = linkedAccounts.some(account => account.providerId === "google");
    const hasGitHub = linkedAccounts.some(account => account.providerId === "github");

    // Définir les providers disponibles selon les comptes déjà liés
    const availableProviders = [];

    // Ajouter les providers qui ne sont pas encore liés
    if (!hasGoogle) availableProviders.push("google");
    if (!hasGitHub) availableProviders.push("github");
    if (!hasDiscord) availableProviders.push("discord");
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
        <div className="space-y-6">
            <div>
                <h2 className="text-title-h4 font-bold">
                    {t("title")}
                </h2>
                <p className="text-paragraph-sm text-text-sub-600 mt-2">
                    {t("description")}
                </p>
            </div>

            <div className="space-y-4">
                <div className="rounded-lg border border-stroke-soft-200 p-4">
                    <h3 className="text-title-h6 font-semibold mb-2">
                        {t("linkedAccounts")}
                    </h3>

                    {linkedAccounts.length === 0 ? (
                        <p className="text-paragraph-sm text-text-sub-600">
                            {t("noLinkedAccounts")}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {hasDiscord && (
                                <div className="flex items-center justify-between p-3 bg-bg-weak-50 rounded-lg">
                                    <span className="text-paragraph-sm font-medium">
                                        {t("discordConnected")}
                                    </span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            )}
                            {hasGoogle && (
                                <div className="flex items-center justify-between p-3 bg-bg-weak-50 rounded-lg">
                                    <span className="text-paragraph-sm font-medium">
                                        {t("googleConnected")}
                                    </span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            )}
                            {hasGitHub && (
                                <div className="flex items-center justify-between p-3 bg-bg-weak-50 rounded-lg">
                                    <span className="text-paragraph-sm font-medium">
                                        {t("githubConnected")}
                                    </span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Afficher les boutons de connexion selon les providers disponibles */}
                    {availableProviders.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {availableProviders.map((provider) => {
                                const providerConfig = providers.find(p => p.brand === provider);
                                if (!providerConfig) return null;

                                return (
                                    <SocialButton.Root
                                        key={provider}
                                        brand={providerConfig.brand}
                                        mode="stroke"
                                        className="w-full"
                                        onClick={async () => {
                                            try {
                                                const res = await authClient.linkSocial({
                                                    provider: provider as "google" | "github" | "discord",
                                                    callbackURL: PAGES.ACCOUNT_SETTINGS,
                                                });

                                                if (res.error) {
                                                    console.error(`Erreur lors de la connexion avec ${provider}:`, res.error);
                                                    return;
                                                }

                                                console.log(`Connexion avec ${provider} réussie`, res);
                                            } catch (error) {
                                                console.error(`Erreur lors de la connexion avec ${provider}:`, error);
                                            }
                                        }}
                                    >
                                        <SocialButton.Icon as={providerConfig.icon} />
                                        {t(`connectWith${provider.charAt(0).toUpperCase() + provider.slice(1)}`)}
                                    </SocialButton.Root>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Define the tab structure without translations
const tabStructure = [
    {
        key: "myAccount",
        icon: RiUser6Line,
        component: AccountSettings,
    },
    {
        key: "languageRegion",
        icon: RiGlobalLine,
        component: LanguageRegion,
    },
    {
        key: "appearance",
        icon: RiPaletteLine,
        component: Appearance,
    },
    {
        key: "linkAccount",
        icon: RiLink,
        component: LinkAccount,
    },
] as const;

export default function AccountSettingsTabs() {
    const t = useTranslations();

    // Build tabs with translations
    const tabs = tabStructure.map((tab) => ({
        ...tab,
        label: tab.key === "linkAccount" ? t("settings.account.linkAccount") : t(`settings.account.${tab.key}`),
    }));

    // Use nuqs for tab state management
    const [tab, setTab] = useQueryState("tab", {
        defaultValue: "myAccount",
        parse: (value) => {
            return tabs.some((tab) => tab.key === value) ? value : "myAccount";
        },
    });

    // Use the tab state for the active tab
    const activeTab = tab as (typeof tabs)[number]["key"] | (string & {});

    // Handle tab change
    const handleTabChange = (value: string) => {
        setTab(value);
    };

    return (
        <>
            {/* mobile */}
            <TabMenuHorizontal.Root
                value={activeTab}
                onValueChange={handleTabChange}
                className="md:hidden"
            >
                <TabMenuHorizontal.List
                    wrapperClassName="-mx-4 mb-6"
                    className="px-4"
                >
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <TabMenuHorizontal.Trigger key={key} value={key}>
                            <TabMenuHorizontal.Icon as={Icon} />
                            {label}
                        </TabMenuHorizontal.Trigger>
                    ))}
                </TabMenuHorizontal.List>

                {tabs.map(({ key, component: Component }) => (
                    <TabMenuHorizontal.Content
                        key={key}
                        value={key}
                        className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                    >
                        <Suspense fallback={<CursorLoader />}>
                            <Component />
                        </Suspense>
                    </TabMenuHorizontal.Content>
                ))}
            </TabMenuHorizontal.Root>

            {/* desktop */}
            <TabMenuVertical.Root
                value={activeTab}
                onValueChange={handleTabChange}
                className="hidden grid-cols-[auto,1fr] items-start gap-8 md:grid xl:grid-cols-[1fr_minmax(0,352px)_1fr]"
            >
                <div className="block w-[258px] shrink-0 rounded-2xl bg-bg-white-0 p-2.5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                    <h4 className="mb-2 px-2 py-1 text-subheading-xs uppercase text-text-soft-400">
                        {t("settings.account.accountSettings")}
                    </h4>
                    <TabMenuVertical.List>
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <TabMenuVertical.Trigger key={key} value={key}>
                                <TabMenuVertical.Icon as={Icon} />
                                {label}
                                <TabMenuVertical.ArrowIcon
                                    as={RiArrowRightSLine}
                                />
                            </TabMenuVertical.Trigger>
                        ))}
                    </TabMenuVertical.List>
                </div>

                {tabs.map(({ key, component: Component }) => (
                    <TabMenuVertical.Content
                        key={key}
                        value={key}
                        className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                    >
                        <Suspense fallback={<CursorLoader />}>
                            <Component />
                        </Suspense>
                    </TabMenuVertical.Content>
                ))}
            </TabMenuVertical.Root>
        </>
    );
}

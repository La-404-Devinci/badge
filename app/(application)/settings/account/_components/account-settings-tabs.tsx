"use client";

import * as React from "react";
import { Suspense } from "react";

import {
    RiArrowRightSLine,
    RiGlobalLine,
    RiPaletteLine,
    RiUser6Line,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { CursorLoader } from "@/components/ui/cursor-loader";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import * as TabMenuVertical from "@/components/ui/tab-menu-vertical";

import Appearance from "./appearance";
import LanguageRegion from "./language-region";
import AccountSettings from "./my-account";

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
] as const;

export default function AccountSettingsTabs() {
    const t = useTranslations();

    // Build tabs with translations
    const tabs = tabStructure.map((tab) => ({
        ...tab,
        label: t(`settings.account.${tab.key}`),
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

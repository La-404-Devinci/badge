"use client";

import * as React from "react";
import { Suspense } from "react";

import {
    RiArrowRightSLine,
    RiEqualizerLine,
    RiNotificationBadgeLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { CursorLoader } from "@/components/ui/cursor-loader";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import * as TabMenuVertical from "@/components/ui/tab-menu-vertical";

import Method from "./method";
import Preferences from "./preferences";

export default function NotificationSettingsTabs() {
    const t = useTranslations("settings.notificationSettings");
    const tTabs = useTranslations("settings.notificationSettings.tabs");

    const tabs = [
        {
            key: "preferences",
            label: tTabs("preferences"),
            icon: RiEqualizerLine,
            component: Preferences,
        },
        {
            key: "method",
            label: tTabs("method"),
            icon: RiNotificationBadgeLine,
            component: Method,
        },
    ] as const;

    // Use nuqs for tab state management
    const [tab, setTab] = useQueryState("tab", {
        defaultValue: "preferences",
        parse: (value) => {
            return tabs.some((tab) => tab.key === value)
                ? value
                : "preferences";
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

                <Suspense fallback={<CursorLoader />}>
                    {tabs.map(({ key, component: Component }) => (
                        <TabMenuHorizontal.Content
                            key={key}
                            value={key}
                            className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                        >
                            <Component />
                        </TabMenuHorizontal.Content>
                    ))}
                </Suspense>
            </TabMenuHorizontal.Root>

            {/* desktop */}
            <TabMenuVertical.Root
                value={activeTab}
                onValueChange={handleTabChange}
                className="hidden grid-cols-[auto,1fr] items-start gap-8 md:grid xl:grid-cols-[1fr_minmax(0,352px)_1fr]"
            >
                <div className="w-[258px] shrink-0 rounded-2xl bg-bg-white-0 p-2.5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                    <h4 className="mb-2 px-2 py-1 text-subheading-xs uppercase text-text-soft-400">
                        {t("headerTitle")}
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

                <Suspense fallback={<CursorLoader />}>
                    {tabs.map(({ key, component: Component }) => (
                        <TabMenuVertical.Content
                            key={key}
                            value={key}
                            className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                        >
                            <Component />
                        </TabMenuVertical.Content>
                    ))}
                </Suspense>
            </TabMenuVertical.Root>
        </>
    );
}

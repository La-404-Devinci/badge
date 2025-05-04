"use client";

import { Suspense } from "react";

import { RiArrowRightSLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { CursorLoader } from "@/components/ui/cursor-loader";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import * as TabMenuVertical from "@/components/ui/tab-menu-vertical";

import { privacySecurityTabs } from "./tabs";

export default function PrivacySecurityTabs() {
    const t = useTranslations("settings.privacySecurity");
    const tTabs = useTranslations("settings.privacySecurity.tabs");

    // Use nuqs for tab state management
    const [tab, setTab] = useQueryState("tab", {
        defaultValue: privacySecurityTabs[0].slug,
        parse: (value) => {
            return privacySecurityTabs.some((tab) => tab.slug === value)
                ? value
                : privacySecurityTabs[0].slug;
        },
    });

    // Use the tab state for the active tab
    const activeTab = tab as
        | (typeof privacySecurityTabs)[number]["slug"]
        | (string & {});

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
                    {privacySecurityTabs.map(({ slug, key, icon: Icon }) => (
                        <TabMenuHorizontal.Trigger key={slug} value={slug}>
                            <TabMenuHorizontal.Icon as={Icon} />
                            {tTabs(key)}
                        </TabMenuHorizontal.Trigger>
                    ))}
                </TabMenuHorizontal.List>

                <Suspense fallback={<CursorLoader />}>
                    {privacySecurityTabs.map(
                        ({ slug, component: Component }) => (
                            <TabMenuHorizontal.Content
                                key={slug}
                                value={slug}
                                className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                            >
                                <Component />
                            </TabMenuHorizontal.Content>
                        )
                    )}
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
                        {t("selectMenu")}
                    </h4>
                    <TabMenuVertical.List>
                        {privacySecurityTabs.map(
                            ({ slug, key, icon: Icon }) => (
                                <TabMenuVertical.Trigger
                                    key={slug}
                                    value={slug}
                                >
                                    <TabMenuVertical.Icon as={Icon} />
                                    {tTabs(key)}
                                    <TabMenuVertical.ArrowIcon
                                        as={RiArrowRightSLine}
                                    />
                                </TabMenuVertical.Trigger>
                            )
                        )}
                    </TabMenuVertical.List>
                </div>

                <Suspense fallback={<CursorLoader />}>
                    {privacySecurityTabs.map(
                        ({ slug, component: Component }) => (
                            <TabMenuVertical.Content
                                key={slug}
                                value={slug}
                                className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                            >
                                <Component />
                            </TabMenuVertical.Content>
                        )
                    )}
                </Suspense>
            </TabMenuVertical.Root>
        </>
    );
}

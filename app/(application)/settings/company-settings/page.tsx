"use client";

import * as React from "react";

import {
    RiArrowRightSLine,
    RiBuilding2Line,
    RiContactsBookLine,
    RiShareForwardBoxLine,
    RiShareLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import * as TabMenuVertical from "@/components/ui/tab-menu-vertical";

import CompanySettings from "./company-settings";
import ContactInformation from "./contact-information";
import ExportData from "./export-data";
import SocialLinks from "./social-links";

export default function PageCompanySettings() {
    const t = useTranslations("settings.companySettings");

    const tabs = [
        {
            key: "companySettings",
            label: t("tabs.companySettings"),
            icon: RiBuilding2Line,
            component: CompanySettings,
        },
        {
            key: "contactInformation",
            label: t("tabs.contactInformation"),
            icon: RiContactsBookLine,
            component: ContactInformation,
        },
        {
            key: "socialLinks",
            label: t("tabs.socialLinks"),
            icon: RiShareLine,
            component: SocialLinks,
        },
        {
            key: "exportData",
            label: t("tabs.exportData"),
            icon: RiShareForwardBoxLine,
            component: ExportData,
        },
    ] as const;

    type TabKey = (typeof tabs)[number]["key"] | (string & {});

    const [activeTab, setActiveTab] = React.useState<TabKey>("companySettings");

    return (
        <>
            {/* mobile */}
            <TabMenuHorizontal.Root
                value={activeTab}
                onValueChange={setActiveTab}
                className="md:hidden"
            >
                <TabMenuHorizontal.List
                    wrapperClassName="-mx-4 mb-6"
                    className="px-4"
                >
                    {tabs.map(({ label, icon: Icon, key }) => (
                        <TabMenuHorizontal.Trigger key={key} value={label}>
                            <TabMenuHorizontal.Icon as={Icon} />
                            {label}
                        </TabMenuHorizontal.Trigger>
                    ))}
                </TabMenuHorizontal.List>

                {tabs.map(({ label, component: Component, key }) => (
                    <TabMenuHorizontal.Content
                        key={key}
                        value={label}
                        className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                    >
                        <Component />
                    </TabMenuHorizontal.Content>
                ))}
            </TabMenuHorizontal.Root>

            {/* desktop */}
            <TabMenuVertical.Root
                value={activeTab}
                onValueChange={setActiveTab}
                className="hidden grid-cols-[auto,1fr] items-start gap-8 md:grid xl:grid-cols-[1fr_minmax(0,352px)_1fr]"
            >
                <div className="w-[258px] shrink-0 rounded-2xl bg-bg-white-0 p-2.5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                    <h4 className="mb-2 px-2 py-1 text-subheading-xs uppercase text-text-soft-400">
                        {t("selectMenu")}
                    </h4>
                    <TabMenuVertical.List>
                        {tabs.map(({ label, icon: Icon, key }) => (
                            <TabMenuVertical.Trigger key={key} value={label}>
                                <TabMenuVertical.Icon as={Icon} />
                                {label}
                                <TabMenuVertical.ArrowIcon
                                    as={RiArrowRightSLine}
                                />
                            </TabMenuVertical.Trigger>
                        ))}
                    </TabMenuVertical.List>
                </div>

                {tabs.map(({ label, component: Component, key }) => (
                    <TabMenuVertical.Content
                        key={key}
                        value={label}
                        className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4"
                    >
                        <Component />
                    </TabMenuVertical.Content>
                ))}
            </TabMenuVertical.Root>
        </>
    );
}

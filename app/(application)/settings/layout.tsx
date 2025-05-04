"use client";

import { useMemo } from "react";

import { RiSettings2Line } from "@remixicon/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Header from "@/app/(application)/_components/header";
import * as Select from "@/components/ui/select";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";

type SettingsItem = {
    label: string;
    key: string;
    href: string;
    disabled?: boolean;
};

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const t = useTranslations("settings");
    const pathname = usePathname();
    const router = useRouter();

    const items: SettingsItem[] = [
        {
            label: t("items.account"),
            key: "account",
            href: "/settings/account",
        },
        {
            label: t("items.notification"),
            key: "notification",
            href: "/settings/notification",
        },
        {
            label: t("items.privacySecurity"),
            key: "privacy-security",
            href: "/settings/privacy-security",
        },
    ];

    const selectedPathname = useMemo(
        () => items.find((item) => pathname.startsWith(item.href))?.href,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    return (
        <>
            <Header
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiSettings2Line className="size-6 text-text-sub-600" />
                    </div>
                }
                title={t("title")}
                description={t("description")}
                contentClassName="hidden"
            />

            <div className="px-4 lg:px-8">
                <Select.Root
                    defaultValue={selectedPathname}
                    onValueChange={(val) => router.push(val)}
                >
                    <Select.Trigger className="md:hidden">
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                        {items
                            .filter((item) => !item.disabled)
                            .map((item) => (
                                <Select.Item
                                    key={item.key}
                                    value={item.href}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </Select.Item>
                            ))}
                    </Select.Content>
                </Select.Root>

                <TabMenuHorizontal.Root defaultValue={selectedPathname}>
                    <TabMenuHorizontal.List className="hidden md:flex">
                        {items
                            .filter((item) => !item.disabled)
                            .map(({ label, href, key }) => (
                                <TabMenuHorizontal.Trigger
                                    key={key}
                                    value={href}
                                    asChild
                                >
                                    <Link href={href}>{label}</Link>
                                </TabMenuHorizontal.Trigger>
                            ))}
                    </TabMenuHorizontal.List>
                </TabMenuHorizontal.Root>

                <div className="py-5 md:py-8">{children}</div>
            </div>
        </>
    );
}

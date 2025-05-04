import { RiAdminLine } from "@remixicon/react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import Header from "@/app/(application)/_components/header";
import { PAGES } from "@/constants/pages";
import { getServerSession } from "@/lib/auth/utils";

import AdminLayoutClient from "./_components/admin-layout-client";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== "admin") {
        redirect(PAGES.DASHBOARD);
    }

    const t = await getTranslations("admin");

    return (
        <>
            <Header
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiAdminLine className="size-6 text-text-sub-600" />
                    </div>
                }
                title={t("title")}
                description={t("description")}
                contentClassName="hidden"
            />

            <AdminLayoutClient
                items={[
                    {
                        label: t("items.users"),
                        key: "users",
                        href: PAGES.ADMIN_USERS,
                    },
                    {
                        label: t("items.waitlist"),
                        key: "waitlist",
                        href: PAGES.ADMIN_WAITLIST,
                    },
                    {
                        label: t("items.settings"),
                        key: "settings",
                        href: PAGES.ADMIN_SETTINGS,
                        disabled: true,
                    },
                ]}
            >
                {children}
            </AdminLayoutClient>
        </>
    );
}

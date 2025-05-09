"use client";

import { useMemo } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import * as Select from "@/components/ui/select";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import { cn } from "@/lib/utils";

export type AdminItem = {
    label: string;
    key: string;
    href: string;
    disabled?: boolean;
};

interface AdminLayoutClientProps {
    items: AdminItem[];
    children: React.ReactNode;
}

export default function AdminLayoutClient({
    items,
    children,
}: AdminLayoutClientProps) {
    const pathname = usePathname();
    const router = useRouter();

    const selectedPathname = useMemo(
        () => items.find((item) => pathname.startsWith(item.href))?.href,
        [pathname, items]
    );

    return (
        <div className="px-4 lg:px-8">
            <Select.Root
                defaultValue={selectedPathname}
                onValueChange={(val) => router.push(val)}
            >
                <Select.Trigger className="md:hidden">
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {items.map((item) => (
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
                    {items.map(({ label, href, key, disabled }) => (
                        <TabMenuHorizontal.Trigger
                            key={key}
                            value={href}
                            asChild
                            disabled={disabled}
                            className={cn(
                                disabled && "opacity-50 pointer-events-none"
                            )}
                        >
                            <Link href={href}>{label}</Link>
                        </TabMenuHorizontal.Trigger>
                    ))}
                </TabMenuHorizontal.List>
            </TabMenuHorizontal.Root>

            <div className="py-5 md:py-8">{children}</div>
        </div>
    );
}

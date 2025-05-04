"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import NotificationButton from "@/components/notification-button";
import { SearchMenuButton } from "@/components/search";
import { PAGES } from "@/constants/pages";

import MobileMenu from "./mobile-menu";

export default function HeaderMobile() {
    return (
        <div className="flex h-[60px] w-full items-center justify-between border-b border-stroke-soft-200 px-4 lg:hidden">
            <Link href={PAGES.DASHBOARD} className="shrink-0">
                <Logo className="size-7" />
            </Link>

            <div className="flex gap-3">
                <SearchMenuButton />

                <NotificationButton />

                <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200" />

                <MobileMenu />
            </div>
        </div>
    );
}

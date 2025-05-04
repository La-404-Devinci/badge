"use client";

import {
    RiArrowDownSLine,
    RiArrowRightSLine,
    RiErrorWarningLine,
    RiLogoutBoxRLine,
    RiSettings2Line,
} from "@remixicon/react";
import clsx from "clsx";
import Link from "next/link";
import { useTranslations } from "next-intl";

import * as Avatar from "@/components/ui/avatar";
import * as Divider from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
import * as Switch from "@/components/ui/switch";
import { PAGES } from "@/constants/pages";
import { PROJECT } from "@/constants/project";
import { User } from "@/db/schema";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils/cn";
import { signOut } from "@/server/actions/sign-out";

// Define a type for avatar colors
type AvatarColor = "yellow" | "gray" | "blue" | "purple" | "sky" | "red";

// Shared components
function UserAvatar({
    user,
    color = "yellow" as const,
}: {
    user?: { image?: string | null };
    color?: AvatarColor;
}) {
    return (
        <Avatar.Root size="40" color={color}>
            {user?.image && <Avatar.Image src={user.image} alt="" />}
        </Avatar.Root>
    );
}

function LoadingState({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left",
                className
            )}
        >
            <Avatar.Root size="40" className="animate-pulse"></Avatar.Root>
            <div className="flex-1 space-y-1" data-hide-collapsed>
                <div className="h-4 w-24 animate-pulse rounded bg-bg-weak-50"></div>
                <div className="h-3 w-32 animate-pulse rounded bg-bg-weak-50"></div>
            </div>
        </div>
    );
}

function ErrorState({ className }: { className?: string }) {
    const t = useTranslations("components.userButton");

    return (
        <div
            className={cn(
                "flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left text-red-500",
                className
            )}
        >
            <Avatar.Root size="40" color="red">
                <div className="flex items-center justify-center">
                    <RiErrorWarningLine className="size-5" />
                </div>
            </Avatar.Root>
            <div className="flex-1 space-y-1" data-hide-collapsed>
                <div className="text-label-sm">{t("sessionError")}</div>
                <div className="text-paragraph-xs">{t("tryReloading")}</div>
            </div>
        </div>
    );
}

function UserInfo({
    user,
    className,
    labelSize = "sm",
    paragraphSize = "xs",
}: {
    user?: User;
    className?: string;
    labelSize?: "sm" | "md";
    paragraphSize?: "xs" | "sm";
}) {
    return (
        <div className={cn("flex-1 space-y-1 min-w-0", className)}>
            <div className={`flex items-center gap-1 text-label-${labelSize}`}>
                <span className="truncate">{user?.name}</span>
            </div>
            <div
                className={`text-paragraph-${paragraphSize} text-text-sub-600 truncate`}
            >
                {user?.email}
            </div>
        </div>
    );
}

function UserHeader() {
    const { user } = useUserData();

    return (
        <div className="px-2 py-2 mb-1">
            <div className="flex items-center gap-3">
                <UserAvatar user={user} color="yellow" />
                <div className="flex flex-1 justify-between items-center gap-2">
                    <div>
                        <div className="font-medium text-label-sm">
                            {user?.name}
                        </div>
                        <div className="text-paragraph-sm text-text-sub-600">
                            {user?.email}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DropdownContent() {
    const { isDarkTheme, getThemeIcon, getThemeText, handleThemeChange } =
        useUserData();
    const t = useTranslations("components.userButton");

    const ThemeIcon = getThemeIcon();

    return (
        <>
            <UserHeader />
            <Dropdown.Item
                onSelect={(e) => {
                    e.preventDefault();
                    handleThemeChange();
                }}
            >
                <Dropdown.ItemIcon as={ThemeIcon} />
                {getThemeText()}
                <span className="flex-1" />
                <Switch.Root checked={isDarkTheme} />
            </Dropdown.Item>
            <Divider.Root variant="dotted-line" />
            <Dropdown.Group>
                <Dropdown.Item asChild>
                    <Link href={PAGES.ACCOUNT_SETTINGS}>
                        <Dropdown.ItemIcon as={RiSettings2Line} />
                        {t("settings")}
                    </Link>
                </Dropdown.Item>
            </Dropdown.Group>
            <Dropdown.Group>
                <Dropdown.Item onClick={signOut}>
                    <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
                    {t("logout")}
                </Dropdown.Item>
            </Dropdown.Group>
            <div className="p-2 text-paragraph-sm text-text-soft-400">
                {t("versionLabel")}
                {PROJECT.VERSION}
                {" · "}
                <Link href={PAGES.PRIVACY_SECURITY_SETTINGS}>
                    {t("termsAndConditions")}
                </Link>
            </div>
        </>
    );
}

export function UserButton({ className }: { className?: string }) {
    const { user, isLoading, error } = useUserData();

    if (isLoading) {
        return <LoadingState className={className} />;
    }

    if (error) {
        return <ErrorState className={className} />;
    }

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cn(
                    "flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none",
                    className
                )}
            >
                <UserAvatar user={user} />
                <div
                    className="flex w-[172px] shrink-0 items-center gap-3"
                    data-hide-collapsed
                >
                    <div className="flex size-6 items-center justify-center rounded-md">
                        <RiArrowRightSLine className="size-5 text-text-sub-600" />
                    </div>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content side="right" sideOffset={24} align="end">
                <DropdownContent />
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

export function UserButtonMobile({ className }: { className?: string }) {
    const { user, isLoading, error } = useUserData();

    if (isLoading) {
        return <LoadingState className={className} />;
    }

    if (error) {
        return <ErrorState className={className} />;
    }

    return (
        <Dropdown.Root modal={false}>
            <Dropdown.Trigger
                className={cn(
                    "group flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none",
                    className
                )}
            >
                <UserAvatar user={user} />
                <UserInfo user={user} labelSize="md" paragraphSize="sm" />
                <div
                    className={clsx(
                        "flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs",
                        // open
                        "group-data-[state=open]:bg-bg-strong-950 group-data-[state=open]:text-text-white-0 group-data-[state=open]:shadow-none"
                    )}
                >
                    <RiArrowDownSLine className="size-5 group-data-[state=open]:-rotate-180" />
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content side="top" align="end">
                <DropdownContent />
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

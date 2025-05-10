"use client";

import * as React from "react";

import {
    RiAdminLine,
    RiArrowRightSLine,
    RiArtboardLine,
    RiFlashlightLine,
    RiGroupLine,
    RiHomeHeartLine,
    RiSettings2Line,
    RiTrophyLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useHotkeys } from "react-hotkeys-hook";

import { CompanySwitch } from "@/app/(application)/_components/company-switch";
import { UserButton } from "@/app/(application)/_components/user-button";
import * as Divider from "@/components/ui/divider";
import { PAGES } from "@/constants/pages";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils/cn";

import StreakBadge from "./streak-badge";

type NavigationLink = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    disabled?: boolean;
    suffix?: React.ReactNode;
};

export function getNavigationLinks(
    t: ReturnType<typeof useTranslations<"components.sidebar.navigation">>
): NavigationLink[] {
    return [
        { icon: RiHomeHeartLine, label: t("dashboard"), href: PAGES.DASHBOARD },
        {
            icon: RiFlashlightLine,
            label: t("dailyChallenge"),
            href: PAGES.DAILY_CHALLENGE,
            suffix: <StreakBadge />,
        },
        {
            icon: RiTrophyLine,
            label: t("leaderboard"),
            href: PAGES.LEADERBOARD,
            disabled: true,
        },
        {
            icon: RiGroupLine,
            label: t("explore"),
            href: PAGES.EXPLORE,
            disabled: true,
        },
        {
            icon: RiArtboardLine,
            label: t("projects"),
            href: PAGES.PROJECTS,
            disabled: true,
        },
    ];
}

function useCollapsedState(): {
    collapsed: boolean;
    sidebarRef: React.RefObject<HTMLDivElement>;
} {
    const [collapsed, setCollapsed] = React.useState(false);
    const sidebarRef = React.useRef<HTMLDivElement>(null!);

    useHotkeys(
        ["ctrl+b", "meta+b"],
        () => setCollapsed((prev) => !prev),
        { preventDefault: true },
        [collapsed]
    );

    React.useEffect(() => {
        if (!sidebarRef.current) return;

        const elementsToHide = sidebarRef.current.querySelectorAll(
            "[data-hide-collapsed]"
        );

        const listeners: { el: Element; listener: EventListener }[] = [];

        elementsToHide.forEach((el) => {
            const hideListener = () => {
                el.classList.add("hidden");
                el.classList.remove("transition", "duration-300");
            };

            const showListener = () => {
                el.classList.remove("transition", "duration-300");
            };

            if (collapsed) {
                el.classList.add("opacity-0", "transition", "duration-300");
                el.addEventListener("transitionend", hideListener, {
                    once: true,
                });
                listeners.push({ el, listener: hideListener });
            } else {
                el.classList.add("transition", "duration-300");
                el.classList.remove("hidden");
                setTimeout(() => {
                    el.classList.remove("opacity-0");
                }, 1);
                el.addEventListener("transitionend", showListener, {
                    once: true,
                });
                listeners.push({ el, listener: showListener });
            }
        });

        return () => {
            listeners.forEach(({ el, listener }) => {
                el.removeEventListener("transitionend", listener);
            });
        };
    }, [collapsed]);

    return { collapsed, sidebarRef };
}

export function SidebarHeader({ collapsed }: { collapsed?: boolean }) {
    return (
        <div
            className={cn("lg:p-3", {
                "lg:px-2": collapsed,
            })}
        >
            <CompanySwitch
                className={cn("transition-all duration-200 ease-out", {
                    "w-16": collapsed,
                })}
            />
        </div>
    );
}

function NavigationMenu({ collapsed }: { collapsed: boolean }) {
    const pathname = usePathname();
    const t = useTranslations("components.sidebar.navigation");
    const navigationLinks = getNavigationLinks(t);

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    "p-1 text-subheading-xs uppercase text-text-soft-400",
                    {
                        "-mx-2.5 w-14 px-0 text-center": collapsed,
                    }
                )}
            >
                {t("main")}
            </div>
            <div className="space-y-1">
                {navigationLinks.map(
                    ({ icon: Icon, label, href, disabled, suffix }, i) => (
                        <Link
                            key={i}
                            href={href}
                            aria-current={
                                pathname === href ? "page" : undefined
                            }
                            aria-disabled={disabled}
                            className={cn(
                                "group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50",
                                "transition duration-200 ease-out",
                                "aria-[current=page]:bg-bg-weak-50",
                                "aria-[disabled]:pointer-events-none aria-[disabled]:opacity-50",
                                {
                                    "w-9 px-2": collapsed,
                                    "w-full px-3": !collapsed,
                                }
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base transition duration-200 ease-out",
                                    {
                                        "-left-[22px]": collapsed,
                                        "-left-5": !collapsed,
                                        "scale-100": pathname === href,
                                        "scale-0": pathname !== href,
                                    }
                                )}
                            />
                            <Icon
                                className={cn(
                                    "size-5 shrink-0 text-text-sub-600 transition duration-200 ease-out",
                                    "group-aria-[current=page]:text-primary-base"
                                )}
                            />

                            <div
                                className="flex w-[180px] shrink-0 items-center gap-2"
                                data-hide-collapsed
                            >
                                <div className="flex-1 text-label-sm">
                                    {label}
                                </div>
                                {suffix
                                    ? suffix
                                    : pathname === href && (
                                          <RiArrowRightSLine className="size-5 text-text-sub-600" />
                                      )}
                            </div>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}

function SettingsAndSupport({ collapsed }: { collapsed: boolean }) {
    const pathname = usePathname();
    const { user } = useUserData();
    const t = useTranslations("components.sidebar.settings");

    const links = [
        {
            href: PAGES.ACCOUNT_SETTINGS,
            current: pathname.includes("/settings"),
            icon: RiSettings2Line,
            label: t("settingsLink"),
        },
        {
            href: PAGES.ADMIN_USERS,
            current: pathname.includes("/admin"),
            icon: RiAdminLine,
            label: t("admin"),
            role: "admin",
        },
    ];

    return (
        <div className="mt-auto space-y-2">
            <div
                className={cn(
                    "p-1 text-subheading-xs uppercase text-text-soft-400",
                    {
                        "-mx-2.5 w-14 px-0 text-center": collapsed,
                    }
                )}
            >
                {t("title")}
            </div>
            <div className="space-y-1.5">
                {links
                    .filter((link) => {
                        if (link.role && user?.role !== link.role) {
                            return false;
                        }
                        return true;
                    })
                    .map(({ href, icon: Icon, label, current }, i) => {
                        return (
                            <Link
                                key={i}
                                href={href}
                                aria-current={current ? "page" : undefined}
                                className={cn(
                                    "group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-label-sm text-text-sub-600 transition duration-200 ease-out hover:bg-bg-weak-50",
                                    "aria-[current=page]:bg-bg-weak-50",
                                    "aria-[disabled]:pointer-events-none aria-[disabled]:opacity-50",
                                    {
                                        "w-9 px-2": collapsed,
                                        "w-full px-3": !collapsed,
                                    }
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base transition duration-200 ease-out",
                                        {
                                            "-left-[22px]": collapsed,
                                            "-left-5": !collapsed,
                                            "scale-100": current,
                                            "scale-0": !current,
                                        }
                                    )}
                                />
                                <Icon
                                    className={cn(
                                        "size-5 shrink-0",
                                        "group-aria-[current=page]:text-primary-base"
                                    )}
                                />
                                <div
                                    className="flex w-[180px] shrink-0 items-center gap-2"
                                    data-hide-collapsed
                                >
                                    <span className="flex-1">{label}</span>
                                    {current && (
                                        <RiArrowRightSLine className="size-5 text-text-sub-600" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
    return (
        <div
            className={cn("p-3", {
                "px-2": collapsed,
            })}
        >
            <UserButton
                className={cn("transition-all duration-200 ease-out", {
                    "w-auto": collapsed,
                })}
            />
        </div>
    );
}

function SidebarDivider({ collapsed }: { collapsed: boolean }) {
    return (
        <div className="px-5">
            <Divider.Root
                className={cn("transition-all duration-200 ease-out", {
                    "w-10": collapsed,
                })}
            />
        </div>
    );
}

interface SidebarProps {
    showBanner?: boolean;
}

export default function Sidebar({ showBanner = false }: SidebarProps) {
    const { collapsed, sidebarRef } = useCollapsedState();

    return (
        <>
            <div
                className={cn(
                    "fixed left-0 top-0 z-40 hidden h-full overflow-hidden border-r border-stroke-soft-200 bg-bg-white-0 transition-all duration-300 ease-out lg:block",
                    {
                        "w-20": collapsed,
                        "w-[272px]": !collapsed,
                        "pt-[44px]": showBanner,
                    }
                )}
            >
                <div
                    ref={sidebarRef}
                    className="flex h-full w-[272px] min-w-[272px] flex-col overflow-auto"
                >
                    <SidebarHeader collapsed={collapsed} />

                    <SidebarDivider collapsed={collapsed} />

                    <div
                        className={cn("flex flex-1 flex-col gap-5 pb-4 pt-5", {
                            "px-[22px]": collapsed,
                            "px-5": !collapsed,
                        })}
                    >
                        <NavigationMenu collapsed={collapsed} />
                        <SettingsAndSupport collapsed={collapsed} />
                    </div>

                    <SidebarDivider collapsed={collapsed} />

                    <UserProfile collapsed={collapsed} />
                </div>
            </div>

            {/* a necessary placeholder because of sidebar is fixed */}
            <div
                className={cn("shrink-0", {
                    "w-[272px]": !collapsed,
                    "w-20": collapsed,
                })}
            />
        </>
    );
}

"use client";

import {
    RiChromeLine,
    RiCloseLine,
    RiFirefoxLine,
    RiMacbookLine,
    RiSmartphoneLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import { authClient } from "@/lib/auth/client";

function SessionSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
            <div className="flex size-10 items-center justify-center rounded-full bg-faded-lighter" />
            <div className="flex-1 space-y-1">
                <div className="h-4 w-24 rounded bg-faded-lighter" />
                <div className="h-3 w-32 rounded bg-faded-lighter" />
            </div>
        </div>
    );
}

export default function ActiveSessions() {
    const t = useTranslations("settings.privacySecurity.activeSessions");
    const {
        data: sessions,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["user-sessions"],
        queryFn: () => authClient.listSessions(),
    });

    const getDeviceIcon = (userAgent: string) => {
        if (userAgent.includes("iPhone") || userAgent.includes("Android"))
            return RiSmartphoneLine;
        if (userAgent.includes("Mac")) return RiMacbookLine;
        if (userAgent.includes("Firefox")) return RiFirefoxLine;
        if (userAgent.includes("Chrome")) return RiChromeLine;
        return RiChromeLine; // default
    };

    const getDeviceName = (userAgent: string) => {
        if (userAgent?.includes("Android")) return "Android";
        if (userAgent?.includes("iPhone")) return "Apple iPhone";
        if (userAgent?.includes("iPad")) return "Apple iPad";
        if (userAgent?.includes("Mac")) return "Apple Mac";
        if (userAgent?.includes("Firefox")) return "Mozilla Firefox";
        if (userAgent?.includes("Chrome")) return "Google Chrome";
        return t("unknownDevice");
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <div className="text-label-md">{t("title")}</div>
                <p className="mt-1 text-paragraph-sm text-text-sub-600">
                    {t("description")}
                </p>
            </div>

            <Divider.Root variant="line-spacing" />

            <div className="flex flex-col gap-3">
                {isLoading ? (
                    <>
                        <SessionSkeleton />
                        <SessionSkeleton />
                    </>
                ) : (
                    sessions?.data?.map((session) => {
                        const Icon = getDeviceIcon(
                            session.userAgent ?? "unknown"
                        );
                        return (
                            <div
                                key={session.token}
                                className="flex items-center gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200"
                            >
                                <div className="flex size-10 items-center justify-center rounded-full bg-faded-lighter">
                                    <Icon className="size-5 text-text-sub-600" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="text-label-sm">
                                        {getDeviceName(
                                            session.userAgent ?? "unknown"
                                        )}
                                        <span className="ml-1 text-paragraph-xs text-text-sub-600">
                                            (
                                            {formatDistanceToNow(
                                                session.createdAt,
                                                { addSuffix: true }
                                            )}
                                            )
                                        </span>
                                    </div>
                                    <div className="text-paragraph-xs text-text-sub-600 truncate max-w-[200px]">
                                        {session.ipAddress}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        authClient
                                            .revokeSession({
                                                token: session.token,
                                            })
                                            .then(() => {
                                                refetch();
                                            });
                                    }}
                                >
                                    <RiCloseLine className="size-5 text-text-sub-600" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <Button.Root
                onClick={() => {
                    authClient.revokeOtherSessions().then(() => {
                        refetch();
                    });
                }}
                variant="error"
                mode="stroke"
                className="mt-1 w-full"
            >
                {t("signOutAllDevices")}
            </Button.Root>
        </div>
    );
}

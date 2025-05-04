import { RiComputerLine, RiMoonLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { useTRPC } from "@/trpc/client";

export type BadgeColor =
    | "gray"
    | "blue"
    | "purple"
    | "orange"
    | "yellow"
    | "sky"
    | "red"
    | "green"
    | "pink"
    | "teal";

export function useUserData() {
    const { theme, setTheme, systemTheme } = useTheme();
    const trpc = useTRPC();
    const t = useTranslations("components.themeSelector");

    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useQuery(
        trpc.user.getMe.queryOptions(undefined, {
            staleTime: 0,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        })
    );

    const handleThemeChange = () => {
        if (theme === "system") {
            if (systemTheme === "dark") {
                setTheme("light");
            } else {
                setTheme("dark");
            }
        } else {
            setTheme(theme === "dark" ? "light" : "dark");
        }
    };

    const getThemeIcon = () => {
        if (theme === "system") {
            return RiComputerLine;
        }
        return RiMoonLine;
    };

    const getThemeText = () => {
        if (theme === "system") {
            return t("systemWithMode", {
                mode: t(systemTheme === "dark" ? "darkMode" : "lightMode"),
            });
        }
        return t(theme === "dark" ? "darkMode" : "lightMode");
    };

    const isDarkTheme =
        theme === "dark" || (theme === "system" && systemTheme === "dark");

    return {
        user,
        isLoading,
        error,
        theme,
        systemTheme,
        handleThemeChange,
        getThemeIcon,
        getThemeText,
        isDarkTheme,
        refetch,
    };
}

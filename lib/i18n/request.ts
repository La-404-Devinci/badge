import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { I18N_CONFIG, LOCALE } from "@/constants/project";
import { env } from "@/env";
import { api } from "@/trpc/server";

import { inferLocaleFromHeader } from "./utils";

export default getRequestConfig(async () => {
    let locale: LOCALE = I18N_CONFIG.DEFAULT_LOCALE;

    try {
        // Try to get user preferences for authenticated users
        const userLocale = await api.user.getUserLocale();
        if (userLocale) {
            locale = userLocale as LOCALE;
        }
    } catch {
        // If there's an error (likely UNAUTHORIZED), fall back to cookie-based locale
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get("NEXT_LOCALE");

        if (
            localeCookie?.value &&
            I18N_CONFIG.SUPPORTED_LOCALES.includes(localeCookie.value as LOCALE)
        ) {
            // Use locale from cookie if available
            locale = localeCookie.value as LOCALE;
        } else {
            // Try to infer locale from Accept-Language header
            const headersList = await headers();
            const acceptLanguage = headersList.get("Accept-Language");

            const inferredLocale = inferLocaleFromHeader(acceptLanguage);
            if (
                inferredLocale &&
                I18N_CONFIG.SUPPORTED_LOCALES.includes(inferredLocale as LOCALE)
            ) {
                locale = inferredLocale as LOCALE;
                // Call the route handler to set the cookie
                try {
                    await fetch(
                        `${env.BETTER_AUTH_URL}/api/locale?locale=${locale}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                } catch (error) {
                    console.error("Failed to set locale cookie:", error);
                }
            }
        }
    }

    // Load messages for the locale
    return {
        messages: (await import(`./messages/${locale}.json`)).default,
        locale: locale,
    };
});

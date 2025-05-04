import { I18N_CONFIG, LOCALE } from "@/constants/project";

/**
 * Infers the locale from Accept-Language header value
 * Returns a supported locale that best matches the user's language preferences
 */
export function inferLocaleFromHeader(
    acceptLanguage: string | null
): LOCALE | null {
    if (!acceptLanguage) {
        return null;
    }

    // Parse the Accept-Language header
    const preferredLocales = acceptLanguage
        .split(",")
        .map((lang) => {
            const [locale, priority] = lang.trim().split(";q=");
            return {
                locale: locale.trim(),
                priority: priority ? parseFloat(priority) : 1.0,
            };
        })
        .sort((a, b) => b.priority - a.priority)
        .map((item) => item.locale);

    // Find the first supported locale from the user's preferences
    const matchedLocale = preferredLocales.find((preferredLocale) => {
        return I18N_CONFIG.SUPPORTED_LOCALES.some((supportedLocale) =>
            supportedLocale
                .toLowerCase()
                .startsWith(preferredLocale.toLowerCase().split("-")[0])
        );
    });

    if (matchedLocale) {
        // Find the exact supported locale that matches
        const exactMatch = I18N_CONFIG.SUPPORTED_LOCALES.find(
            (supportedLocale) =>
                supportedLocale
                    .toLowerCase()
                    .startsWith(matchedLocale.toLowerCase().split("-")[0])
        );

        if (exactMatch) {
            return exactMatch;
        }
    }

    return null;
}

/**
 * Get default date format based on locale
 * Different regions have different date format conventions
 */
export function getDefaultDateFormat(
    locale: string | null
): "MM/DD/YY" | "DD/MM/YY" | "YY/MM/DD" | "YYYY-MM-DD" {
    if (!locale) return "DD/MM/YY"; // Default format

    // North American style (month first)
    if (locale.startsWith("en-US")) {
        return "MM/DD/YY";
    }

    // Asian style (year first)
    if (["zh", "ja", "ko"].some((lang) => locale.startsWith(lang))) {
        return "YY/MM/DD";
    }

    // ISO format
    if (locale.startsWith("sv") || locale.startsWith("fi")) {
        return "YYYY-MM-DD";
    }

    // European style (day first) - default for most other locales
    return "DD/MM/YY";
}

/**
 * Get default time format based on locale
 * Some regions prefer 12-hour clock, others prefer 24-hour clock
 */
export function getDefaultTimeFormat(
    locale: string | null
): "12-hours" | "24-hours" {
    if (!locale) return "24-hours"; // Default format

    // 12-hour clock countries
    if (["en-US", "en-CA", "en-AU", "en-NZ", "en-PH"].includes(locale)) {
        return "12-hours";
    }

    // Most other countries use 24-hour format
    return "24-hours";
}

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { AUTH_PAGES } from "@/constants/pages";
import { I18N_CONFIG } from "@/constants/project";

import { CustomMiddleware } from "./chain";

// Create a list of public pages that should i18n routing
const publicPages = [AUTH_PAGES.SIGN_IN];

// Middleware for public pages - uses cookie-based locale
const publicPagesMiddleware = createMiddleware({
    locales: I18N_CONFIG.SUPPORTED_LOCALES,
    defaultLocale: I18N_CONFIG.DEFAULT_LOCALE,
    localeDetection: true,
});

export function withI18nMiddleware(next: CustomMiddleware): CustomMiddleware {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse
    ) => {
        const pathname = request.nextUrl.pathname;

        // Check if the current path is a public page
        const isPublicPage = publicPages.some(
            (page) => pathname === page || pathname.startsWith(`${page}/`)
        );

        if (isPublicPage) {
            // For public pages, use cookie-based locale
            const intlResponse = publicPagesMiddleware(request);
            if (intlResponse) {
                return intlResponse;
            }
        }

        // Continue to the next middleware
        return next(request, event, response);
    };
}

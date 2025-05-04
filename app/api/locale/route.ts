import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { I18N_CONFIG, LOCALE } from "@/constants/project";
import { env } from "@/env";
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    if (!locale || !I18N_CONFIG.SUPPORTED_LOCALES.includes(locale as LOCALE)) {
        return NextResponse.json(
            { error: "Invalid or missing locale" },
            { status: 400 }
        );
    }

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set("NEXT_LOCALE", locale, {
        path: "/",
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return NextResponse.json({ success: true, locale });
}

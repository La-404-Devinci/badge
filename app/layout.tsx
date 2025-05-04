import localFont from "next/font/local";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { PROJECT } from "@/constants/project";
import { env } from "@/env";
import { cn } from "@/lib/utils/cn";

import { Providers } from "./providers";

import type { Metadata } from "next";

import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: {
        default: PROJECT.NAME,
        template: `${PROJECT.NAME} — %s`,
    },
    description: PROJECT.DESCRIPTION,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={cn(
                geistSans.variable,
                geistMono.variable,
                "antialiased"
            )}
        >
            {env.NEXT_PUBLIC_REACT_SCAN_DEVTOOLS === "true" &&
                env.NODE_ENV === "development" && (
                    <Script
                        crossOrigin="anonymous"
                        src="//unpkg.com/react-scan/dist/auto.global.js"
                    />
                )}
            <body className="bg-bg-white-0 text-text-strong-950">
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <div className="flex min-h-screen flex-col">
                            <main className="flex flex-1 flex-col">
                                {children}
                            </main>
                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/logo";
import * as LinkButton from "@/components/ui/link-button";
import { PAGES } from "@/constants/pages";

const actions = {
    [PAGES.SIGN_IN]: {
        text: "header.signIn.text",
        link: {
            label: "header.signIn.link",
            href: PAGES.SIGN_UP,
        },
    },
    [PAGES.SIGN_UP]: {
        text: "header.signUp.text",
        link: {
            label: "header.signUp.link",
            href: PAGES.SIGN_IN,
        },
    },
    [PAGES.FORGOT_PASSWORD]: {
        text: "header.forgotPassword.text",
        link: {
            label: "header.forgotPassword.link",
            href: PAGES.SIGN_IN,
        },
    },
    [PAGES.VERIFICATION]: {
        text: "header.verification.text",
        link: {
            label: "header.verification.link",
            href: PAGES.SIGN_IN,
        },
    },
    [PAGES.RESET_PASSWORD]: {
        text: "header.resetPassword.text",
        link: {
            label: "header.resetPassword.link",
            href: PAGES.SIGN_IN,
        },
    },
    [PAGES.CONFIRM_ACCESS]: {
        text: "header.confirmAccess.text",
        link: {
            label: "header.confirmAccess.link",
            href: null,
        },
    },
    [PAGES.WAITLIST]: {
        text: "header.waitlist.text",
        link: {
            label: "header.waitlist.link",
            href: PAGES.SIGN_IN,
        },
    },
} as const;

export default function AuthHeader() {
    const t = useTranslations("auth");
    const pathname = usePathname();
    const router = useRouter();

    const action = actions[pathname as keyof typeof actions];
    if (!action) return null;

    return (
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between p-6">
            <Link href={PAGES.DASHBOARD}>
                <Logo className="size-10 shrink-0" />
            </Link>

            <div className="flex items-center gap-1.5">
                <div className="text-paragraph-sm text-text-sub-600">
                    {t(action.text)}
                </div>
                <LinkButton.Root
                    variant="primary"
                    size="medium"
                    underline
                    asChild
                >
                    {action.link.href ? (
                        <Link href={action.link.href}>
                            {t(action.link.label)}
                        </Link>
                    ) : (
                        <span
                            onClick={() => router.back()}
                            className="cursor-pointer"
                        >
                            {t(action.link.label)}
                        </span>
                    )}
                </LinkButton.Root>
            </div>
        </div>
    );
}

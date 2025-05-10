import Link from "next/link";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import { PAGES } from "@/constants/pages";

export default function EmptyState() {
    const t = useTranslations("daily.emptyState");

    return (
        <div className="flex min-h-[inherit] flex-col items-center justify-center gap-4 flex-1">
            <div className="flex flex-col items-center justify-center gap-0.5">
                <h1 className="text-title-h6 font-bold">{t("title")}</h1>
                <p className="text-paragraph-sm text-text-sub-600">
                    {t("description")}
                </p>
            </div>
            <Button.Root asChild>
                <Link href={PAGES.DASHBOARD}>{t("button")}</Link>
            </Button.Root>
        </div>
    );
}

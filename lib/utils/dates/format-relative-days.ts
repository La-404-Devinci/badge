import { differenceInDays, startOfDay } from "date-fns";
import { useTranslations } from "next-intl";

export function formatRelativeDays(
    date: Date,
    t: ReturnType<typeof useTranslations<"common.time">>
) {
    const now = new Date();
    const diff = differenceInDays(startOfDay(now), startOfDay(date));

    if (diff === 0) {
        return t("today");
    } else if (diff === 1) {
        return t("yesterday");
    } else if (diff === -1) {
        return t("tomorrow");
    } else if (diff > 1) {
        return t("daysAgo", { days: diff });
    } else {
        return t("inDays", { days: -diff });
    }
}

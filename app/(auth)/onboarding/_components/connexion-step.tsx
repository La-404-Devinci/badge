import { RiUserLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import DiscordButton from "./discord-button";
import HeaderStep from "./header-step";
export default function ConnexionStep() {
    const t = useTranslations("auth");

    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title={t("onboarding.discordSelection.title")}
                description={t("onboarding.discordSelection.description")}
                icon={<RiUserLine />}
            />
            <DiscordButton />
        </div>
    );
}

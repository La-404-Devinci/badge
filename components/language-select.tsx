"use client";

import { RiGlobalLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import * as Select from "@/components/ui/select";
import { setLocaleCookie } from "@/server/actions/set-locale-cookie";

const languages = [
    {
        value: "en-US",
        label: "English",
    },
    {
        value: "fr-FR",
        label: "Français",
    },
] as const;

export function LanguageSelect(
    props: React.ComponentProps<typeof Select.Root>
) {
    const router = useRouter();
    const locale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        setLocaleCookie(newLocale).then(() => {
            router.refresh();
        });
    };

    return (
        <Select.Root
            defaultValue={locale}
            onValueChange={handleLanguageChange}
            variant="inline"
            {...props}
        >
            <Select.Trigger>
                <Select.TriggerIcon as={RiGlobalLine} />
                <Select.Value placeholder="Select Language" />
            </Select.Trigger>
            <Select.Content>
                {languages.map((lang) => (
                    <Select.Item key={lang.value} value={lang.value}>
                        {lang.label}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}

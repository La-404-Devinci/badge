export const PROJECT = {
    NAME: "NICOLAS BECHARAT Next.js",
    DESCRIPTION:
        "A Next.js boilerplate for building web applications with Nicolas Becharat",
    COMPANY: "NICOLAS BECHARAT",
    HELP_EMAIL: "nicolas@impulselab.ai",
    DOMAIN: "nicolas-becharat.com",
    VERSION: "0.0.1",
};
export const SUPPORTED_LOCALES = ["en-US", "fr-FR"] as const;

export type LOCALE = (typeof SUPPORTED_LOCALES)[number];

export const I18N_CONFIG = {
    DEFAULT_LOCALE: "fr-FR" as const satisfies LOCALE,
    SUPPORTED_LOCALES,
};

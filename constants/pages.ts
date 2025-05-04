export const AUTH_PAGES = {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFICATION: "/verification",
    RESET_PASSWORD: "/reset-password",
    CONFIRM_ACCESS: "/confirm-2fa",
    WAITLIST: "/waitlist",
};

export const APPLICATION_PAGES = {
    DASHBOARD: "/dashboard",
};

export const SETTINGS_PAGES = {
    ACCOUNT_SETTINGS: "/settings/account",
    NOTIFICATION_SETTINGS: "/settings/notification",
    PRIVACY_SECURITY_SETTINGS: "/settings/privacy-security",
};

export const ADMIN_PAGES = {
    ADMIN_USERS: "/admin/users",
    ADMIN_WAITLIST: "/admin/waitlist",
    ADMIN_SETTINGS: "/admin/settings",
};

export const PAGES = {
    ...AUTH_PAGES,
    ...APPLICATION_PAGES,
    ...SETTINGS_PAGES,
    ...ADMIN_PAGES,
};

const CORE_ERRORS = {
    USER_NOT_FOUND: "USER_NOT_FOUND",
    FAILED_TO_CREATE_USER: "FAILED_TO_CREATE_USER",
    FAILED_TO_CREATE_SESSION: "FAILED_TO_CREATE_SESSION",
    FAILED_TO_UPDATE_USER: "FAILED_TO_UPDATE_USER",
    FAILED_TO_GET_SESSION: "FAILED_TO_GET_SESSION",
    INVALID_PASSWORD: "INVALID_PASSWORD",
    INVALID_EMAIL: "INVALID_EMAIL",
    INVALID_EMAIL_OR_PASSWORD: "INVALID_EMAIL_OR_PASSWORD",
    INVALID_OTP: "INVALID_OTP",
    SOCIAL_ACCOUNT_ALREADY_LINKED: "SOCIAL_ACCOUNT_ALREADY_LINKED",
    PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND",
    INVALID_TOKEN: "INVALID_TOKEN",
    ID_TOKEN_NOT_SUPPORTED: "ID_TOKEN_NOT_SUPPORTED",
    FAILED_TO_GET_USER_INFO: "FAILED_TO_GET_USER_INFO",
    USER_EMAIL_NOT_FOUND: "USER_EMAIL_NOT_FOUND",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
    PASSWORD_TOO_LONG: "PASSWORD_TOO_LONG",
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    EMAIL_CAN_NOT_BE_UPDATED: "EMAIL_CAN_NOT_BE_UPDATED",
    CREDENTIAL_ACCOUNT_NOT_FOUND: "CREDENTIAL_ACCOUNT_NOT_FOUND",
    EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE",
    COULDNT_UPDATE_YOUR_EMAIL: "COULDNT_UPDATE_YOUR_EMAIL",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INVALID_TWO_FACTOR_COOKIE: "INVALID_TWO_FACTOR_COOKIE",
    INVALID_TWO_FACTOR_AUTHENTICATION: "INVALID_TWO_FACTOR_AUTHENTICATION",
    INVALID_BACKUP_CODE: "INVALID_BACKUP_CODE",
    BANNED_USER: "BANNED_USER",
};

export const AUTH_ERRORS = {
    ...CORE_ERRORS,
};

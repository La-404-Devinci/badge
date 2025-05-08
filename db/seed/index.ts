import { seed } from "drizzle-seed";
import { ulid } from "ulid";

import { USER_ROLES } from "@/constants/roles";

import { db } from "../index";
import { user, account, session, verification } from "../schema/auth-schema";
import { notificationSettings } from "../schema/notification-settings";
import { userPreferences } from "../schema/user-preferences";

const main = async () => {
    // Valeurs possibles
    const userRoles = Object.values(USER_ROLES);
    const languages = ["en-US", "fr-FR"];
    const timezones = [
        "GMT+00:00",
        "GMT+01:00",
        "GMT+02:00",
        "GMT-05:00",
        "GMT-08:00",
    ];
    const timeFormats = ["12-hours", "24-hours"];
    const dateFormats = ["MM/DD/YY", "DD/MM/YY", "YY/MM/DD", "YYYY-MM-DD"];
    const avatars = Array.from(
        { length: 5 },
        (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`
    );

    const biography = [
        "I'm a software engineer",
        "I'm a designer",
        "I'm a developer",
        "I'm a tester",
        "I'm a manager",
        "I'm a leader",
        "I'm a developer",
        "I'm a designer",
        "I'm a software engineer",
        "I'm a developer",
    ];

    const positions = [
        "Software Engineer",
        "Designer",
        "Developer",
        "Tester",
        "Manager",
        "Leader",
        "Developer",
        "Designer",
        "Software Engineer",
        "Developer",
    ];

    // Dates de référence
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setFullYear(now.getFullYear() + 1);

    // IDs utilisateurs générés à l'avance pour maintenir la cohérence des FK
    const userIds = Array.from({ length: 10 }, () => ulid());
    // Tokens de session uniques
    const sessionTokens = Array.from({ length: 5 }, () => ulid());

    try {
        // 1) Seed users
        await seed(db, { user }).refine((funcs) => ({
            user: {
                count: 10,
                columns: {
                    id: funcs.valuesFromArray({
                        values: userIds,
                        isUnique: true,
                    }),
                    name: funcs.fullName(),
                    email: funcs.email(),
                    emailVerified: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                            false,
                        ],
                    }),
                    image: funcs.valuesFromArray({ values: avatars }),
                    role: funcs.valuesFromArray({ values: userRoles }),
                    banned: funcs.valuesFromArray({
                        values: [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                        ],
                    }),
                    username: funcs.int({
                        minValue: 10000,
                        maxValue: 20000,
                        isUnique: true,
                    }),
                    biography: funcs.valuesFromArray({ values: biography }),
                    position: funcs.valuesFromArray({ values: positions }),
                    banReason: funcs.default({ defaultValue: null }),
                    banExpires: funcs.default({ defaultValue: null }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                },
            },
        }));

        // 2) Seed accounts
        await seed(db, { account }).refine((funcs) => ({
            account: {
                count: 10,
                columns: {
                    providerId: funcs.valuesFromArray({
                        values: ["github", "google", "credentials"],
                    }),
                    userId: funcs.valuesFromArray({ values: userIds }),
                    accessToken: funcs.default({ defaultValue: () => ulid() }),
                    refreshToken: funcs.default({ defaultValue: () => ulid() }),
                    idToken: funcs.default({ defaultValue: () => ulid() }),
                    accessTokenExpiresAt: funcs.default({
                        defaultValue: futureDate,
                    }),
                    refreshTokenExpiresAt: funcs.default({
                        defaultValue: futureDate,
                    }),
                    scope: funcs.default({ defaultValue: "read write" }),
                    password: funcs.default({ defaultValue: null }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                },
            },
        }));

        // 3) Seed sessions
        await seed(db, { session }).refine((funcs) => ({
            session: {
                count: 5,
                columns: {
                    expiresAt: funcs.default({ defaultValue: futureDate }),
                    // Utiliser tokens uniques pré-générés
                    token: funcs.valuesFromArray({
                        values: sessionTokens,
                        isUnique: true,
                    }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                    ipAddress: funcs.default({ defaultValue: "127.0.0.1" }),
                    userAgent: funcs.default({
                        defaultValue:
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                    }),
                    userId: funcs.valuesFromArray({
                        values: userIds.slice(0, 5),
                    }),
                    impersonatedBy: funcs.default({ defaultValue: null }),
                },
            },
        }));

        // 4) Seed verifications
        await seed(db, { verification }).refine((funcs) => ({
            verification: {
                count: 5,
                columns: {
                    identifier: funcs.email({ arraySize: 1 }),
                    value: funcs.default({ defaultValue: () => ulid() }),
                    expiresAt: funcs.default({ defaultValue: futureDate }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                },
            },
        }));

        // 5) Seed user preferences
        await seed(db, { userPreferences }).refine((funcs) => ({
            userPreferences: {
                count: userIds.length,
                columns: {
                    userId: funcs.valuesFromArray({
                        values: userIds,
                        isUnique: true,
                    }),
                    language: funcs.valuesFromArray({ values: languages }),
                    timezone: funcs.valuesFromArray({ values: timezones }),
                    timeFormat: funcs.valuesFromArray({ values: timeFormats }),
                    dateFormat: funcs.valuesFromArray({ values: dateFormats }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                },
            },
        }));

        // 6) Seed notification settings
        await seed(db, { notificationSettings }).refine((funcs) => ({
            notificationSettings: {
                count: userIds.length,
                columns: {
                    userId: funcs.valuesFromArray({
                        values: userIds,
                        isUnique: true,
                    }),
                    newsUpdatesEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                            false,
                            false,
                        ],
                    }),
                    promotionsOffersEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                            false,
                            false,
                            false,
                            false,
                        ],
                    }),
                    remindersSystemAlertsEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                        ],
                    }),
                    emailEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                        ],
                    }),
                    pushEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            true,
                            false,
                            false,
                            false,
                        ],
                    }),
                    smsEnabled: funcs.valuesFromArray({
                        values: [
                            true,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                        ],
                    }),
                    createdAt: funcs.default({ defaultValue: now }),
                    updatedAt: funcs.default({ defaultValue: now }),
                },
            },
        }));

        console.log("Données seed générées avec succès");
    } catch (error) {
        console.error("Erreur lors de la génération des données seed:", error);
        process.exit(1);
    }
};

main();

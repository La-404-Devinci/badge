import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { user, userPreferences } from "@/db/schema";
import type { ExportedUser, UserPreferences } from "@/db/schema";

import type { UserQueryContextWithInput, ExportUserDataInput } from "./types";

export async function exportUserData({
    db,
    session,
    input,
}: UserQueryContextWithInput<ExportUserDataInput>) {
    const { includePreferences } = input;
    const userId = session.user.id;

    // Get user data
    const [userData] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!userData) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
        });
    }

    interface ExportData {
        user: ExportedUser;
        preferences?: UserPreferences;
    }

    const exportData: ExportData = {
        user: userData,
    };

    // Include preferences if requested
    if (includePreferences) {
        const [preferences] = await db
            .select()
            .from(userPreferences)
            .where(eq(userPreferences.userId, userId))
            .limit(1);

        if (preferences) {
            exportData.preferences = preferences;
        }
    }

    return exportData;
}

import { eq } from "drizzle-orm";

import { badgeType } from "@/db/schema/badges";

import type { BadgeQueryContext } from "../queries/types";

interface UpdateBadgeParams {
    id: string;
    name?: string;
    displayName?: string;
    description?: string;
    image?: string;
    color?: string;
    maxLevel?: number;
    baseExp?: number;
    expMultiplier?: number;
}

export const updateBadge = async (
    { db }: BadgeQueryContext,
    params: UpdateBadgeParams
) => {
    const { id, ...updateData } = params;

    // Vérifier si le badge existe
    const existingBadge = await db
        .select()
        .from(badgeType)
        .where(eq(badgeType.id, id))
        .limit(1);

    if (existingBadge.length === 0) {
        throw new Error("Badge not found");
    }

    // Mettre à jour le badge
    const [updatedBadge] = await db
        .update(badgeType)
        .set({
            ...updateData,
            updatedAt: new Date(),
        })
        .where(eq(badgeType.id, id))
        .returning();

    return updatedBadge;
};

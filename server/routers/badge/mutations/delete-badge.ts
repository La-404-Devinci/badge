import { eq } from "drizzle-orm";

import { badgeType } from "@/db/schema/badges";

import type { BadgeQueryContext } from "../queries/types";

interface DeleteBadgeParams {
    id: string;
}

export const deleteBadge = async (
    { db }: BadgeQueryContext,
    params: DeleteBadgeParams
) => {
    const { id } = params;

    // Vérifier si le badge existe
    const existingBadge = await db
        .select()
        .from(badgeType)
        .where(eq(badgeType.id, id))
        .limit(1);

    if (existingBadge.length === 0) {
        throw new Error("Badge not found");
    }

    // Supprimer le badge
    await db.delete(badgeType).where(eq(badgeType.id, id));

    return { success: true, deletedId: id };
};

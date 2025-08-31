import { eq } from "drizzle-orm";

import { badgeType } from "@/db/schema/badges";

import type { BadgeQueryContext } from "../queries/types";

interface CreateBadgeParams {
    name: string;
    displayName: string;
    description: string;
    image: string;
    color: string;
    maxLevel: number;
    baseExp: number;
    expMultiplier: number;
}

export const createBadge = async (
    { db }: BadgeQueryContext,
    params: CreateBadgeParams
) => {
    const {
        name,
        displayName,
        description,
        image,
        color,
        maxLevel,
        baseExp,
        expMultiplier,
    } = params;

    // Vérifier si un badge avec le même nom existe déjà
    const existingBadge = await db
        .select()
        .from(badgeType)
        .where(eq(badgeType.name, name))
        .limit(1);

    if (existingBadge.length > 0) {
        throw new Error("A badge with this name already exists");
    }

    // Créer le nouveau badge
    const [newBadge] = await db
        .insert(badgeType)
        .values({
            name,
            displayName,
            description,
            image,
            color,
            maxLevel,
            baseExp,
            expMultiplier,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();

    return newBadge;
};

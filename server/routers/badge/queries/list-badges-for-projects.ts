import { asc } from "drizzle-orm";

import { badgeType } from "@/db/schema/badges";

import type { BadgeQueryContext } from "./types";

export const listBadgesForProjects = async ({ db }: BadgeQueryContext) => {
    // Récupérer tous les badges disponibles pour les projets
    const badges = await db
        .select({
            id: badgeType.id,
            name: badgeType.name,
            displayName: badgeType.displayName,
            description: badgeType.description,
            image: badgeType.image,
            color: badgeType.color,
            baseExp: badgeType.baseExp,
            expMultiplier: badgeType.expMultiplier,
        })
        .from(badgeType)
        .orderBy(asc(badgeType.displayName));

    return {
        badges,
    };
};

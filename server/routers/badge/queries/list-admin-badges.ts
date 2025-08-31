import { and, desc, eq, ilike, asc } from "drizzle-orm";

import { badgeType } from "@/db/schema/badges";

import type { BadgeQueryContext } from "./types";

interface ListAdminBadgesParams {
    page: number;
    limit: number;
    sortBy?: "name" | "displayName" | "createdAt" | "maxLevel";
    sortOrder?: "asc" | "desc";
    search?: string;
    type?: string;
    color?: string;
}

export const listAdminBadges = async (
    { db }: BadgeQueryContext,
    params: ListAdminBadgesParams
) => {
    const {
        page,
        limit,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        type,
        color,
    } = params;
    const offset = (page - 1) * limit;

    // Construire les conditions de filtrage
    const whereConditions = [];

    if (search) {
        whereConditions.push(
            and(
                ilike(badgeType.name, `%${search}%`),
                ilike(badgeType.displayName, `%${search}%`),
                ilike(badgeType.description, `%${search}%`)
            )
        );
    }

    if (type) {
        whereConditions.push(eq(badgeType.name, type));
    }

    if (color) {
        whereConditions.push(eq(badgeType.color, color));
    }

    const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Construire l'ordre de tri
    let orderBy;
    switch (sortBy) {
        case "name":
            orderBy =
                sortOrder === "asc"
                    ? asc(badgeType.name)
                    : desc(badgeType.name);
            break;
        case "displayName":
            orderBy =
                sortOrder === "asc"
                    ? asc(badgeType.displayName)
                    : desc(badgeType.displayName);
            break;
        case "maxLevel":
            orderBy =
                sortOrder === "asc"
                    ? asc(badgeType.maxLevel)
                    : desc(badgeType.maxLevel);
            break;
        case "createdAt":
        default:
            orderBy =
                sortOrder === "asc"
                    ? asc(badgeType.createdAt)
                    : desc(badgeType.createdAt);
            break;
    }

    // Récupérer le total d'éléments
    const totalResult = await db
        .select({ count: badgeType.id })
        .from(badgeType)
        .where(whereClause);

    const totalItems = totalResult.length;

    // Récupérer les badges avec pagination
    const badges = await db
        .select()
        .from(badgeType)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        badges,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
    };
};

import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { project } from "@/db/schema";

import type {
    ListAdminProjectsInput,
    ListAdminProjectsQueryContext,
} from "./types";

export async function listAdminProjects({
    db,
    input,
}: ListAdminProjectsQueryContext<ListAdminProjectsInput>) {
    try {
        const { search, status, type, page, limit } = input;
        const offset = (page - 1) * limit;

        // Build where conditions
        const whereConditions = [];

        if (search) {
            whereConditions.push(
                or(
                    ilike(project.title, `%${search}%`),
                    ilike(project.description, `%${search}%`)
                )
            );
        }

        if (status && status !== "all") {
            whereConditions.push(eq(project.status, status));
        }

        if (type && type !== "all") {
            whereConditions.push(eq(project.type, type));
        }

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(project)
            .where(
                whereConditions.length > 0 ? and(...whereConditions) : undefined
            );

        const total = countResult[0]?.count || 0;

        // Get projects with pagination
        const projects = await db
            .select()
            .from(project)
            .where(
                whereConditions.length > 0 ? and(...whereConditions) : undefined
            )
            .orderBy(desc(project.createdAt))
            .limit(limit)
            .offset(offset);

        return {
            success: true,
            data: projects,
            total,
            page,
            limit,
        };
    } catch (error) {
        console.error("Error listing admin projects:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to list projects",
        });
    }
}

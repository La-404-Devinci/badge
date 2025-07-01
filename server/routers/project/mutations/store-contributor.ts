import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import { projectContributor } from "@/db/schema";

import { ProjectMutationContext, StoreContributorInput } from "./types";

export async function storeContributor({
    db,
    session,
    input,
}: ProjectMutationContext<StoreContributorInput>) {
    const userId = session.user.id;

    try {
        const contributor = await db
            .select()
            .from(projectContributor)
            .where(
                and(
                    eq(projectContributor.userId, userId),
                    eq(projectContributor.projectId, input.projectId)
                )
            );

        if (contributor.length > 0) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Contributor already exists",
            });
        }

        const storeContributor = await db.insert(projectContributor).values({
            projectId: input.projectId,
            userId,
        });

        return { success: true, data: storeContributor };
    } catch (error) {
        console.error("Error storing contributor:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to store contributor",
        });
    }
}

import { eq } from "drizzle-orm";

import { user } from "@/db/schema";

import type { CheckUsernameExistsInput, UserMutationContext } from "./types";

export async function checkUsernameExists({
    db,
    input,
}: UserMutationContext<CheckUsernameExistsInput>) {
    const [existing] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.username, input.username))
        .limit(1);

    return existing;
}

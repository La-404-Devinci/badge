import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { banMultipleUsers } from "./mutations/index";
import { listUsers } from "./queries/index";
import { banMultipleUsersSchema, listUsersSchema } from "./validators";

export const authRouter = router({
    // Queries
    listUsers: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(listUsersSchema)
        .query(async ({ ctx, input }) => {
            const { db } = ctx;

            return await listUsers({ input, db });
        }),

    // Mutations
    banMultipleUsers: protectedProcedure
        .meta({ roles: ["admin"] })
        .input(banMultipleUsersSchema)
        .mutation(async ({ input }) => {
            return await banMultipleUsers({ input });
        }),
});

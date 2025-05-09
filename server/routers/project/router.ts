import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { storeProject } from "./mutations/index";
import { storeProjectSchema } from "./validators";

// Project router
export const projectRouter = router({
    // Mutations
    storeProject: protectedProcedure
        .input(storeProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeProject({ db, session, input });
        }),
});

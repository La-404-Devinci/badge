import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { storeFile } from "./mutations/index";
import { storeFileSchema } from "./validators";
// File router
export const fileRouter = router({
    // Mutations
    storeFile: protectedProcedure
        .input(storeFileSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await storeFile({ db, session, input });
        }),
});

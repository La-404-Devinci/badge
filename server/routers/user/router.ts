import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { saveUserPreferences, updateUserProfile } from "./mutations/index";
import {
    exportUserData,
    getMe,
    getUserLocale,
    getUserPreferences,
    getUserProfile,
} from "./queries/index";
import {
    exportUserDataSchema,
    updateUserProfileSchema,
    userPreferencesSchema,
} from "./validators";

// User router
export const userRouter = router({
    // Queries
    getMe: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        return await getMe({ db, session });
    }),

    getUserLocale: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        return await getUserLocale({ db, session });
    }),

    getUserPreferences: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        return await getUserPreferences({ db, session });
    }),

    getUserProfile: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        return await getUserProfile({ db, session });
    }),

    exportUserData: protectedProcedure
        .input(exportUserDataSchema)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await exportUserData({ db, session, input });
        }),

    // Mutations
    saveUserPreferences: protectedProcedure
        .input(userPreferencesSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await saveUserPreferences({ db, session, input });
        }),

    updateUserProfile: protectedProcedure
        .input(updateUserProfileSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await updateUserProfile({ db, session, input });
        }),
});

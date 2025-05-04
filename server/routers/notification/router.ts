import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import {
    toggleNotificationSetting,
    updateNotificationSettings,
} from "./mutations/index";
import { getUserNotificationSettings } from "./queries/index";
import {
    toggleNotificationSettingSchema,
    updateNotificationSettingsSchema,
} from "./validators";

// Notification settings router
export const notificationRouter = router({
    // Queries
    getUserNotificationSettings: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        return await getUserNotificationSettings({ db, session });
    }),

    // Mutations
    updateNotificationSettings: protectedProcedure
        .input(updateNotificationSettingsSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await updateNotificationSettings({ db, session, input });
        }),

    toggleNotificationSetting: protectedProcedure
        .input(toggleNotificationSettingSchema)
        .mutation(async ({ ctx, input }) => {
            const { db, session } = ctx;
            return await toggleNotificationSetting({ db, session, input });
        }),
});

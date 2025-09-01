import { schedules } from "@trigger.dev/sdk/v3";

import { checkExpiredProjects } from "./check-expired-projects";

export const dailyCheckExpiredProjects = schedules.task({
    id: "daily-check-expired-projects",
    description: "Triggers the daily check for expired projects at 2 AM UTC",

    cron: {
        pattern: "0 2 * * *", // 2 AM UTC every day
        timezone: "UTC",
    },

    run: async () => {
        await checkExpiredProjects.trigger({
            createdBy: null,
        });
    },
});

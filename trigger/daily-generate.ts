import { schedules } from "@trigger.dev/sdk/v3";

import { dailyTask } from "./generate-challenge";

export const dailyGenerateTask = schedules.task({
    id: "daily-generate-challenge",
    description: "Triggers the daily challenge generation task at midnight",

    cron: {
        pattern: "0 0 * * *", // UTC midnight, every day
        timezone: "Europe/Paris",
    },

    run: async () => {
        await dailyTask.trigger({
            createdBy: null,
        });
    },
});

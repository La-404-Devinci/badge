import { runs } from "@trigger.dev/sdk/v3";

import { dailyTask } from "@/trigger/generate-challenge";

// Get a list of running generate exercise tasks
export const listGenerateQueue = async () => {
    try {
        const runsList = await runs.list({
            taskIdentifier: dailyTask.id,
        });

        return {
            success: true,
            runs: runsList.data
                .filter((run) => run.isExecuting)
                .map((run) => ({
                    id: run.id,
                    startedAt: run.startedAt,
                    createdAt: run.createdAt,
                })),
        };
    } catch (error) {
        console.error("Error fetching generate queue:", error);
        return {
            success: false,
            runs: [],
        };
    }
};

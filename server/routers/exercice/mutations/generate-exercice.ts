import { tasks } from "@trigger.dev/sdk/v3";

import { dailyTask } from "@/trigger/generate-challenge";

import { InputMutationContext } from "./types";

export const generateExercice = async ({
    input,
}: InputMutationContext<string>) => {
    const task = await tasks.triggerAndPoll<typeof dailyTask>(
        dailyTask.id,
        {
            createdBy: input,
        },
        {
            pollIntervalMs: 750,
        }
    );

    return {
        success: task.isSuccess,
        id: task.id,
    };
};

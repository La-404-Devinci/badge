import { tasks } from "@trigger.dev/sdk/v3";

import { dailyTask } from "@/trigger/generate-challenge";

import { InputMutationContext } from "./types";

export const generateExercice = async ({
    input,
}: InputMutationContext<string>) => {
    // Trigger task without waiting for completion
    const handle = await tasks.trigger(dailyTask.id, {
        createdBy: input,
    });

    return {
        id: handle.id,
    };
};

import { executeCode } from "./execute-code";
import type { ValidationResult } from "./types";

export const validateSubmission = async (
    db: any,
    code: string,
    validationInputs: string[],
    validationOutputs: string[]
): Promise<ValidationResult> => {
    for (let index = 0; index < validationInputs.length; index++) {
        const call = validationInputs[index];
        const expectedOutput = validationOutputs[index];

        const result = await executeCode({
            input: {
                code: code,
                call: call,
            },
        });

        if (!result.success) {
            return {
                success: false,
                call: call,
                expectedOutput: expectedOutput,
                output: result.error || "Erreur d'exécution",
                logs: result.logs,
            };
        }

        if (result.result !== expectedOutput) {
            return {
                success: false,
                call: call,
                expectedOutput: expectedOutput,
                output: result.result,
                logs: result.logs,
            };
        }
    }

    return { success: true };
};

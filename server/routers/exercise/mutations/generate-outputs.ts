import { executeCode } from "./execute-code";
import { InputMutationContext } from "./types";

interface GenerateOutputsInput {
    id: string;
    response: string;
    exampleInputs: string[];
    validationInputs: string[];
}

export const generateOutputs = async ({
    input,
    db,
}: InputMutationContext<GenerateOutputsInput>) => {
    const { response, exampleInputs, validationInputs } = input;

    // Generate example outputs
    const exampleOutputs = await Promise.all(
        exampleInputs.map(async (call) => {
            const result = await executeCode({
                input: { code: response, call },
                db,
            });
            if (!result.success) {
                throw new Error(
                    `Failed to generate example output for ${call}: ${result.error}`
                );
            }
            return JSON.parse(result.result); // Parse the stringified result
        })
    );

    // Generate validation outputs
    const validationOutputs = await Promise.all(
        validationInputs.map(async (call) => {
            const result = await executeCode({
                input: { code: response, call },
                db,
            });
            if (!result.success) {
                throw new Error(
                    `Failed to generate validation output for ${call}: ${result.error}`
                );
            }
            return JSON.parse(result.result); // Parse the stringified result
        })
    );

    return {
        exampleOutputs,
        validationOutputs,
    };
};

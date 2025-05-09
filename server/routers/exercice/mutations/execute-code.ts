import * as typescript from "typescript";
import { z } from "zod";

import { executeCodeSchema } from "../validators";
import { ExecuteCodeOutput, InputMutationContext } from "./types";

export type ExecuteCodeInput = z.infer<typeof executeCodeSchema>;

/**
 * Transpiles TypeScript code to JavaScript
 */
function transpileTypeScript(code: string): string {
    try {
        const result = typescript.transpileModule(code, {
            compilerOptions: {
                module: typescript.ModuleKind.CommonJS,
                target: typescript.ScriptTarget.ES2020,
                strict: false,
                esModuleInterop: true,
                skipLibCheck: true,
                skipDefaultLibCheck: true,
            },
        });

        return result.outputText;
    } catch (error) {
        console.error("TypeScript transpilation error:", error);
        throw new Error(
            "Failed to transpile TypeScript: " +
                (error instanceof Error ? error.message : String(error))
        );
    }
}

export const executeCode = async ({
    input,
}: InputMutationContext<ExecuteCodeInput>) => {
    try {
        const { code, call } = input;

        // Transpile TypeScript code to JavaScript
        const jsCode = transpileTypeScript(code);

        // Dynamically import the isolated-vm module
        // This approach is more compatible with Next.js
        const ivm = await import("isolated-vm");

        // Create a new isolate with memory limits
        const isolate = new ivm.Isolate({
            memoryLimit: 16, // 16MB limit
        });

        // Create a new context within the isolate
        const context = await isolate.createContext();

        // Get reference to the global object within the context
        const global = context.global;

        // Make the global object available as 'global'
        await global.set("global", global.derefInto());

        // Execute the user-provided code
        const script = await isolate.compileScript(jsCode);
        await script.run(context, { timeout: 5000 });

        // Execute the function call
        const callScript = await isolate.compileScript(`
            (function() {
                try {
                    return JSON.stringify({
                        success: true,
                        result: JSON.stringify(${call})
                    });
                } catch (error) {
                    return JSON.stringify({
                        success: false,
                        error: error.message || 'Unknown error occurred'
                    });
                }
            })();
        `);

        // Run with timeout
        const resultJson = await callScript.run(context, { timeout: 5000 });

        // Parse the result
        const result = JSON.parse(resultJson) as ExecuteCodeOutput;

        // Dispose the isolate to free memory
        isolate.dispose();

        return result;
    } catch (error) {
        console.error(error);
        return {
            success: false as const,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
};

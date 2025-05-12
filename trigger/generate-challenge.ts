import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { logger, task } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";
import { addDays } from "date-fns";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { exercise } from "@/db/schema";
import { env } from "@/env";
import { difficultyToScore } from "@/server/routers/exercise/utils/difficulty-to-score";

const getPrompt = (props: {
    oldExercises: { title: string; description: string }[];
}) => `You are a generator for TypeScript coding exercises for a learning platform.

Your task is to output a **single** exercise in a custom pseudo-XML format. The structure must follow the rules below.

⚠️ Important formatting rules:
- The content inside \`<problem>\` and \`<hint>\` is parsed as **Markdown**.
- The output must be strictly formatted and self-contained.
- Do **not** include any commentary or explanation outside the XML tags.

---

## Input constraint:
You will be given a list of existing exercises in the format:
**title: description**
You must **not** generate any problem with the same title or the same idea as any in the list. Avoid rewording or restating them.

---

## Tags Specification:

### \`<title>\` (required)
A short, descriptive title for the exercise.

**Example:**
\`\`\`
<title>
Two Sum
</title>
\`\`\`

---

### \`<description>\` (required)

A short summary of the problem (maximum 80 characters). This is used as a meta description.

**Example:**
\`\`\`
<description>
Find indices of two numbers in an array that add up to a target.
</description>
\`\`\`

---

### \`<problem>\` (required)

The full Markdown-formatted description of the problem.
Explain what inputs the function receives, what it should return, and any constraints or assumptions.

**Example:**
\`\`\`
<problem>
Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up* to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.
</problem>
\`\`\`

---

### \`<hint>\` (optional, any number)

Markdown-formatted clues or strategies to help the user solve the problem.

**Example:**
\`\`\`
<hint>
A *brute force solution* is fine to start with, then look for optimizations.
</hint>
\`\`\`

---

### \`<response>\` (required)

A valid TypeScript function named \`func\` with a full signature and correct logic.

**Example:**
\`\`\`
<response>
function func(nums: number[], target: number): number[] {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
</response>
\`\`\`

---

### \`<example_input>\` (required, at least two)

Each tag must contain a call to \`func(...)\` with **simple inputs**.

**Example:**
\`\`\`
<example_input>
func([2, 7, 11, 15], 9)
</example_input>
\`\`\`

---

### \`<validation_input>\` (required, at least five)

Each tag must contain a call to \`func(...)\` with more complex or edge-case inputs.

**Example:**
\`\`\`
<validation_input>
func([1, 3, 4, 2, 6, 7], 13)
</validation_input>
\`\`\`

---

### \`<difficulty>\` (recommended)

A difficulty rating for the exercise.
Can be one of the following:
- easy
- medium
- hard

**Example:**
\`\`\`
<difficulty>
easy
</difficulty>
\`\`\`

---

### Final output format (template to follow):

\`\`\`
<title>
[Title]
</title>
<description>
[Short meta description]
</description>
<problem>
[Markdown problem statement]
</problem>
<hint>
[Optional hint]
</hint>
<response>
function func(/* args */): /* return type */ {
    // solution
}
</response>
<example_input>
func(/* input */)
</example_input>
<validation_input>
func(/* input */)
</validation_input>
<difficulty>
[Difficulty]
</difficulty>
\`\`\`

You will also be provided with a list like the following. **Do not repeat** any of these:

**Already used problems:**

${props.oldExercises.map((e) => '* "' + e.title + ": " + e.description + '"').join("\n")}

Generate a new, original problem that does not overlap with the above titles or ideas.`;

/**
 * Parse the output of the AI to get each <tag> with content
 *
 * @param text The output of the AI
 * @returns An object with the <tag> as the key and the content as the value
 */
const parseOutput = (text: string): Record<string, string[]> => {
    const regex = /<(\w+)>([\s\S]*?)<\/\1>/g;

    const matches = text.matchAll(regex);
    const result: Record<string, string[]> = {};

    for (const match of matches) {
        const tag = match[1];
        const content = match[2];

        if (!result[tag]) {
            result[tag] = [];
        }

        result[tag].push(content);
    }

    return result;
};

// Task that runs every day at midnight
export const dailyTask = task({
    id: "generate-challenge",
    description: "Generates a daily challenge",

    run: async (payload: { createdBy: string | null }) => {
        // Get last exercises
        logger.info("Getting last exercises");

        const lastExercises = await db.query.exercise.findMany({
            orderBy: [desc(exercise.createdAt)],
            limit: 20,
            columns: {
                title: true,
                description: true,
            },
        });

        logger.info(`Found ${lastExercises.length} exercises`);

        const openrouter = createOpenRouter({
            apiKey: env.OPENROUTER_API_KEY,
        });

        logger.info("Generating text");

        const { text } = await generateText({
            model: openrouter.chat(env.OPENROUTER_MODEL),
            prompt: getPrompt({
                oldExercises: lastExercises,
            }),
        });

        logger.info(`Text generated (${text.length} characters)`);

        // Parse the output
        const output = parseOutput(text);

        logger.info(
            `Parsed output, found tags: ${Object.keys(output).join(", ")}`
        );

        // Create a new exercise in the database if we have all required fields
        if (
            output.title?.length !== 1 ||
            output.description?.length !== 1 ||
            output.problem?.length !== 1 ||
            output.response?.length !== 1 ||
            output.example_input?.length < 2 ||
            output.validation_input?.length < 5
        ) {
            return {
                status: "failed",
                message: "Invalid output",
                details: { output },
                processedAt: new Date().toISOString(),
            };
        }

        logger.info("Adding new exercise to the database");

        const newExercise = await db
            .insert(exercise)
            .values({
                title: output.title[0].trim(),
                description: output.description[0].trim(),
                score: difficultyToScore(output.difficulty?.[0]?.trim()),

                problem: output.problem[0].trim(),
                hints: output.hint?.map((hint) => hint.trim()) || [],
                response: output.response[0].trim(),
                exampleInputs: output.example_input.map((input) =>
                    input.trim()
                ),
                validationInputs: output.validation_input.map((input) =>
                    input.trim()
                ),

                difficulty: output.difficulty?.[0]?.trim() || "unknown",

                status: "draft",
                dailyChallengeDate: addDays(new Date(), 1)
                    .toISOString()
                    .split("T")[0],

                systemCreated: payload.createdBy === null,
                createdBy: payload.createdBy,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        logger.info(
            `New exercise added to the database with id: ${newExercise[0].id}`
        );

        return {
            status: "completed",
            message: "Challenge generated successfully",
            details: { exercise: newExercise[0] },
            processedAt: new Date().toISOString(),
        };
    },
});

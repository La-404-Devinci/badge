import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().url(),
        RESEND_API_KEY: z.string().min(1),
        RESEND_FROM_EMAIL: z.string().min(1),

        BLOB_READ_WRITE_TOKEN: z.string().min(1),

        NODE_ENV: z.enum(["development", "production"]),
        VERCEL_URL: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_REACT_QUERY_DEVTOOLS: z.enum(["true", "false"]).optional(),
        NEXT_PUBLIC_REACT_SCAN_DEVTOOLS: z.enum(["true", "false"]).optional(),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_REACT_QUERY_DEVTOOLS:
            process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS,
        NEXT_PUBLIC_REACT_SCAN_DEVTOOLS:
            process.env.NEXT_PUBLIC_REACT_SCAN_DEVTOOLS,
    },
    onValidationError: (issues) => {
        console.error(
            "❌ Invalid environment variables:",
            JSON.stringify(issues, null, 2)
        );
        throw new Error(
            `Invalid environment variables: ${JSON.stringify(issues)}`
        );
    },
});

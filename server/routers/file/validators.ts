import { z } from "zod";

export const storeFileSchema = z.object({
    files: z.array(
        z.object({
            originalFileName: z.string().min(1),
            fileSize: z.number().min(1),
        })
    ),
});

export type StoreFileInput = z.infer<typeof storeFileSchema>;

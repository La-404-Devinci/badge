import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

import { file as fileTable } from "@/db/schema/file";
import { createPresignedUrlToUpload } from "@/lib/minio/server";
import type { ShortFileProp, PresignedUrlProp } from "@/lib/minio/server";

import type { FileMutationContext } from "./types";

const bucketName = process.env.MINIO_BUCKET_NAME!;
const isSSL = process.env.MINIO_SSL === "true";
const endpoint = process.env.MINIO_ENDPOINT!;
const port = process.env.MINIO_PORT!;
const expiry = 60 * 60;

export async function storeFile({
    db,
    input,
}: FileMutationContext<{ files: ShortFileProp[] }>) {
    try {
        const files = input.files;
        if (!files?.length) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No files to upload",
            });
        }

        const presignedUrls: PresignedUrlProp[] = await Promise.all(
            files.map(async (file) => {
                const fileName = nanoid(12);
                const url = await createPresignedUrlToUpload({
                    bucketName,
                    fileName,
                    expiry,
                });

                return {
                    fileNameInBucket: fileName,
                    originalFileName: file.originalFileName,
                    fileSize: file.fileSize,
                    url,
                };
            })
        );

        const publicUrls = presignedUrls.map((p) => ({
            ...p,
            publicUrl: `http${isSSL ? "s" : ""}://${endpoint}:${port}/${bucketName}/${p.fileNameInBucket}`,
        }));

        const fileRecords = publicUrls.map((p) => ({
            id: nanoid(),
            name: p.originalFileName,
            bucket: bucketName,
            fileName: p.fileNameInBucket,
            originalName: p.originalFileName,
            size: p.fileSize,
            url: p.publicUrl,
        }));

        const insertedFiles = await db
            .insert(fileTable)
            .values(fileRecords)
            .returning();

        return { publicUrls, file: insertedFiles };
    } catch (error) {
        console.error("storeFile error:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal error",
        });
    }
}

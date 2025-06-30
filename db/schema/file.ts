import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const file = pgTable("file", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    bucket: text("bucket").notNull(),
    fileName: text("file_name").notNull(),
    originalName: text("original_name").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
});

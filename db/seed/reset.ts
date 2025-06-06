import "dotenv/config";
import { reset } from "drizzle-seed";

import { db } from "../index";
import * as schema from "../schema";

async function main() {
    try {
        console.log("Resetting database...");

        await reset(db, schema);

        console.log("Database reset successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
}

main();

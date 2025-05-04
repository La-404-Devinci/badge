import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";

import { user } from "@/db/schema";

import { InputQueryContext, ListUsersInput } from "./types";

export const listUsers = async ({
    input,
    db,
}: InputQueryContext<ListUsersInput>) => {
    // Build database filters for users
    const userFilters = [];

    if (input.search) {
        userFilters.push(
            or(
                like(user.name, `%${input.search}%`),
                like(user.email, `%${input.search}%`)
            )
        );
    }

    if (input.role && input.role !== "all") {
        userFilters.push(eq(user.role, input.role));
    }

    // Build order by configuration
    const getOrderByConfig = () => {
        const sortDirection = input.sortOrder === "asc" ? asc : desc;

        // Map sort field to actual column
        switch (input.sortBy) {
            case "user":
                return sortDirection(user.name);
            case "role":
                return sortDirection(user.role);
            case "waitlistStatus":
                return sortDirection(sql`access_status.status`);
            default:
                return sortDirection(user.createdAt);
        }
    };

    // Get users with their waitlist status included
    const users = await db.query.user.findMany({
        where: userFilters.length > 0 ? and(...userFilters) : undefined,
        with: {
            accessStatus: true,
        },
        orderBy: [getOrderByConfig()].filter(Boolean),
    });

    // Filter by waitlist status if specified
    let filteredUsers = [...users];
    if (input.waitlistStatus && input.waitlistStatus !== "all") {
        filteredUsers = users.filter(
            (user) => user.accessStatus?.status === input.waitlistStatus
        );
    }

    // Apply pagination
    const total = filteredUsers.length;
    const offset = (input.page - 1) * input.limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + input.limit);

    // Return paginated result
    return {
        users: paginatedUsers,
        pagination: {
            total,
            page: input.page,
            limit: input.limit,
            totalPages: Math.ceil(total / input.limit),
            hasNextPage: input.page < Math.ceil(total / input.limit),
            hasPreviousPage: input.page > 1,
        },
    };
};

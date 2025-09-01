import { z } from "zod";

import protectedProcedure from "@/server/procedures/protected-procedure";
import { router } from "@/server/trpc";

import { listAdminBadges, listBadgesForProjects } from "./queries";
import { createBadge, updateBadge, deleteBadge } from "./mutations";

const listAdminBadgesSchema = z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.enum(["name", "displayName", "createdAt", "maxLevel"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    type: z.string().optional(),
    color: z.string().optional(),
});

const createBadgeSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    displayName: z.string().min(1, "Le nom d'affichage est requis"),
    description: z.string().min(1, "La description est requise"),
    image: z.string().min(1, "L'image est requise"),
    color: z.string().min(1, "La couleur est requise"),
    maxLevel: z.number().min(1, "Le niveau maximum doit être au moins 1"),
    baseExp: z.number().min(1, "L'expérience de base doit être au moins 1"),
    expMultiplier: z
        .number()
        .min(0.1, "Le multiplicateur d'expérience doit être au moins 0.1"),
});

const updateBadgeSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
    name: z.string().min(1, "Le nom est requis").optional(),
    displayName: z.string().min(1, "Le nom d'affichage est requis").optional(),
    description: z.string().min(1, "La description est requise").optional(),
    image: z.string().min(1, "L'image est requise").optional(),
    color: z.string().min(1, "La couleur est requise").optional(),
    maxLevel: z
        .number()
        .min(1, "Le niveau maximum doit être au moins 1")
        .optional(),
    baseExp: z
        .number()
        .min(1, "L'expérience de base doit être au moins 1")
        .optional(),
    expMultiplier: z
        .number()
        .min(0.1, "Le multiplicateur d'expérience doit être au moins 0.1")
        .optional(),
});

const deleteBadgeSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
});

export const badgeRouter = router({
    listAdminBadges: protectedProcedure
        .input(listAdminBadgesSchema)
        .query(async ({ ctx, input }) => {
            return listAdminBadges(ctx, input);
        }),

    listBadgesForProjects: protectedProcedure.query(async ({ ctx }) => {
        return listBadgesForProjects(ctx);
    }),

    create: protectedProcedure
        .input(createBadgeSchema)
        .mutation(async ({ ctx, input }) => {
            return createBadge(ctx, input);
        }),

    update: protectedProcedure
        .input(updateBadgeSchema)
        .mutation(async ({ ctx, input }) => {
            return updateBadge(ctx, input);
        }),

    delete: protectedProcedure
        .input(deleteBadgeSchema)
        .mutation(async ({ ctx, input }) => {
            return deleteBadge(ctx, input);
        }),
});

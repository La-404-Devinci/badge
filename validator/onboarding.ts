import { z } from "zod";

export const personalSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
});

export const positionSchema = z.object({
    position: z.string().nonempty("Veuillez sélectionner un poste"),
    biography: z
        .string()
        .min(3, "Biography must be at least 3 characters long"),
});

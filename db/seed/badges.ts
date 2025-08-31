import { seed } from "drizzle-seed";

import { db } from "../index";
import { badgeType } from "../schema";

const main = async () => {
    try {
        // Seed des types de badges par défaut
        await seed(db, { badgeType }).refine((funcs) => ({
            badgeType: {
                count: 5,
                columns: {
                    name: funcs.valuesFromArray({
                        values: [
                            "daily",
                            "project",
                            "streak",
                            "skill",
                            "achievement",
                        ],
                        isUnique: true,
                    }),
                    displayName: funcs.valuesFromArray({
                        values: [
                            "Défi Quotidien",
                            "Projet",
                            "Série",
                            "Compétence",
                            "Réalisation",
                        ],
                    }),
                    description: funcs.valuesFromArray({
                        values: [
                            "Badge pour la participation aux défis quotidiens",
                            "Badge pour la complétion de projets",
                            "Badge pour les séries de succès consécutifs",
                            "Badge pour les compétences techniques",
                            "Badge pour les réalisations spéciales",
                        ],
                    }),
                    icon: funcs.valuesFromArray({
                        values: [
                            "calendar",
                            "folder",
                            "fire",
                            "star",
                            "trophy",
                        ],
                    }),
                    color: funcs.valuesFromArray({
                        values: ["blue", "green", "orange", "purple", "gold"],
                    }),
                    maxLevel: funcs.valuesFromArray({
                        values: [100, 100, 50, 100, 50],
                    }),
                    baseExp: funcs.valuesFromArray({
                        values: [100, 200, 150, 300, 500],
                    }),
                    expMultiplier: funcs.valuesFromArray({
                        values: [1, 1, 1, 1, 1],
                    }),
                    createdAt: funcs.default({ defaultValue: new Date() }),
                    updatedAt: funcs.default({ defaultValue: new Date() }),
                },
            },
        }));

        console.log("Types de badges seedés avec succès");
    } catch (error) {
        console.error("Erreur lors du seed des badges:", error);
        throw error;
    }
};

export default main;

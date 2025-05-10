import { User } from "@/db/schema";

export type ProjectContributor = {
    id: string;
    projectId: string;
    userId: string;
    user: User;
    updatedAt: Date;
    createdAt: Date;
};

export interface ProjectStatusCardProps {
    project: {
        id: string;
        title: string;
        description: string;
        badgeName: string;
        badgeImage: string;
        startDate: Date;
        endDate: Date;
        type: string;
        exclusive404: boolean;
        status: string;
        projectContributors: ProjectContributor[];
        // Ajoute d'autres champs si besoin
    };
    user: User;
    isContributor: boolean;
}

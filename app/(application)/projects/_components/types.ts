import { User } from "@/db/schema";

export type ProjectContributor = {
    id: string;
    userId: string;
    user: {
        id: string;
        username: string | null;
        image: string | null;
        role?: string;
        position?: string;
    };
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
    };
    user: User;
    isContributor: boolean;
}

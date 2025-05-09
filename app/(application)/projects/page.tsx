"use client";

import * as Avatar from "@/components/ui/avatar";
import { PROJECT } from "@/constants/project";
import { useUserData } from "@/hooks/use-user-data";

import { CreateProjectButton } from "./_components/create-project-button";
import Header from "../_components/header";
import { ScheduleButton } from "../_components/schedule-button";
import { ProjectCard } from "./_components/card";
// Mock data pour les projets
const PROJECTS = [
    {
        id: "1",
        title: "Badge React 2024",
        description:
            "Un événement pour découvrir et maîtriser React avec des ateliers, talks et challenges.",
        badgeName: "Badge React 2024",
        badgeImage: "/badges/react.png",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-07"),
        exclusive404: true,
        type: "Atelier",
        contributors: [
            {
                name: "John Doe",
                image: "/avatars/john-doe.png",
            },
        ],
        skills: [
            {
                title: "React",
                completed: true,
            },
        ],
        progress: 50,
        discussionLink: "https://github.com/JohnDoe/BadgeReact2024/discussions",
    },
    {
        id: "2",
        title: "Badge IA Générative",
        description:
            "Plongez dans l'univers de l'IA générative avec des experts et des projets concrets.",
        badgeName: "Badge IA Générative",
        badgeImage: "/badges/ia.png",
        startDate: new Date("2024-08-15"),
        endDate: new Date("2024-08-22"),
        exclusive404: false,
        type: "Conférence",
        contributors: [
            {
                name: "John Doe",
                image: "/avatars/john-doe.png",
            },
        ],
        skills: [
            {
                title: "IA",
                completed: true,
            },
        ],
        progress: 50,
        discussionLink:
            "https://github.com/JohnDoe/BadgeIAGenerative/discussions",
    },
    {
        id: "3",
        title: "Badge Web3",
        description:
            "Explorez les technologies blockchain et Web3 à travers des workshops et des hackathons.",
        badgeName: "Badge Web3",
        badgeImage: "/badges/web3.png",
        startDate: new Date("2025-05-03"),
        endDate: new Date("2025-05-17"),
        exclusive404: true,
        type: "Hackathon",
        contributors: [
            {
                name: "John Doe",
                image: "/avatars/john-doe.png",
            },
            {
                name: "John Doe",
                image: "/avatars/john-doe.png",
            },
        ],
        skills: [
            {
                title: "Web3",
                completed: true,
            },
        ],
        progress: 50,
    },
];

export default function ProjectsPage() {
    const { user } = useUserData();

    return (
        <>
            <Header
                icon={
                    <Avatar.Root size="48" color="yellow">
                        {user?.image && (
                            <Avatar.Image src={user?.image} alt="" />
                        )}
                    </Avatar.Root>
                }
                title={user?.name}
                description={`Welcome back to ${PROJECT.NAME} 👋🏻`}
                contentClassName="hidden lg:flex"
            >
                <ScheduleButton className="hidden lg:flex" />
                <CreateProjectButton className="hidden lg:flex" />
            </Header>

            <div className="flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(344px,1fr))] items-start justify-center gap-6">
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </>
    );
}

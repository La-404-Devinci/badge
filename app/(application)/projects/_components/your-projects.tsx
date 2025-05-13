"use client";

import { RiAddCircleLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { useUserData } from "@/hooks/use-user-data";
import { useTRPC } from "@/trpc/client";

import { ProjectCard } from "./card";
import { CreateProjectButton } from "./create-project-button";

export default function YourProjects() {
    const trpc = useTRPC();
    const { user } = useUserData();

    const { data: projects, isLoading } = useQuery({
        ...trpc.project.getContributorProjects.queryOptions(undefined, {
            staleTime: 0,
        }),
    });

    const hasProjects = projects?.data && projects.data.length > 0;

    return (
        <div className="flex flex-col gap-4 lg:p-4 h-full">
            <div className="flex items-start justify-between flex-col gap-4">
                <h2 className="text-2xl font-bold">Vos inscriptions</h2>
                <CreateProjectButton />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <CursorLoader className="size-4 animate-spin" />
                </div>
            ) : !hasProjects ? (
                <div className="flex flex-1 flex-col items-center justify-center border border-dashed border-neutral-200 rounded-xl p-8 bg-gray-50">
                    <span className="bg-white rounded-full p-4 shadow-sm mb-4">
                        <RiAddCircleLine className="w-8 h-8 text-gray-400" />
                    </span>
                    <p className="text-gray-600 text-center text-base font-medium mb-1">
                        Aucun projet pour linstant
                    </p>
                    <p className="text-gray-500 text-center text-sm mb-6 max-w-xs">
                        Creez votre premier projet pour commencer à collaborer
                        et organiser votre travail.
                    </p>
                    <CreateProjectButton />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {projects.data.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            user={user!}
                            isContributor={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

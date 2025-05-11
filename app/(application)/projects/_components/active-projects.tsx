"use client";

import { useQuery } from "@tanstack/react-query";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { useUserData } from "@/hooks/use-user-data";
import { useTRPC } from "@/trpc/client";

import { ProjectCard } from "./card";
export default function ActiveProjects() {
    const { user } = useUserData();

    const trpc = useTRPC();

    const { data, isLoading } = useQuery({
        ...trpc.project.getProjects.queryOptions(undefined, {
            staleTime: 0,
        }),
    });

    return (
        <div className="flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-label-md font-semibold">
                        Active Projects
                    </h2>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <CursorLoader className="size-4 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(344px,1fr))] items-start justify-center gap-6">
                    {data?.data.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            user={user!}
                            isContributor={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

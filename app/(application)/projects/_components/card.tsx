"use client";
import {
    RiGithubLine,
    RiMessage2Line,
    RiDiscordFill,
    RiFileTextLine,
} from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as ProgressBar from "@/components/ui/progress-bar";
import * as Tooltip from "@/components/ui/tooltip";
import { USER_ROLES } from "@/constants/roles";
import { useTRPC } from "@/trpc/client";

import { ContributorsCard } from "./contributors-card";
import { DateCard } from "./date-card";
import { ProjectStatusCardProps } from "./types";
export function ProjectCard({
    project,
    user,
    isContributor,
}: ProjectStatusCardProps) {
    const now = new Date().getTime();
    const total = project.endDate.getTime() - project.startDate.getTime();
    const elapsed = now - project.startDate.getTime();
    const progress = Math.max(
        0,
        Math.min(100, Math.round((elapsed / total) * 100))
    );
    const trpc = useTRPC();

    const queryClient = useQueryClient();

    const { mutateAsync: storeContributor } = useMutation(
        trpc.project.storeContributor.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: trpc.project.getProjects.queryKey(),
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.project.getContributorProjects.queryKey(),
                });

                toast.success("Contributor added");
            },
            onError: () => {
                toast.error("Failed to add contributor");
            },
        })
    );

    const { mutateAsync: deleteContributor } = useMutation(
        trpc.project.deleteContributor.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: trpc.project.getProjects.queryKey(),
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.project.getContributorProjects.queryKey(),
                });

                toast.success("Contributor deleted");
            },
            onError: () => {
                toast.error("Failed to delete contributor");
            },
        })
    );
    const handleParticipate = (action: "leave" | "participate") => {
        console.log(action, "action");
        if (action === "leave") {
            deleteContributor({ projectId: project.id });
        } else {
            storeContributor({ projectId: project.id });
        }
    };

    return (
        <div>
            <div className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg rounded-lg border border-neutral-200 p-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-start w-full">
                        <div className="space-y-2">
                            <Badge.Root
                                variant="light"
                                className={
                                    progress === 100
                                        ? "bg-green-100 text-green-600"
                                        : "bg-blue-100 text-blue-600"
                                }
                            >
                                {project.startDate > new Date()
                                    ? "Upcoming"
                                    : progress === 100
                                      ? "Completed"
                                      : "In Progress"}
                            </Badge.Root>
                            <h3 className="text-2xl font-semibold">
                                {project.title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Image
                                        src={project.badgeImage}
                                        alt={project.badgeName}
                                        width={64}
                                        height={64}
                                        className="size-9 rounded-md"
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    {project.badgeName}
                                </Tooltip.Content>
                            </Tooltip.Root>
                            {project.exclusive404 && (
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <Button.Root
                                            variant="neutral"
                                            mode="lighter"
                                            size="small"
                                        >
                                            <RiDiscordFill className="size-4 " />
                                        </Button.Root>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <span>404</span>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            )}
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <Button.Root
                                        variant="neutral"
                                        mode="lighter"
                                        size="small"
                                    >
                                        {project.type === "dev" ? (
                                            <RiGithubLine className="size-4" />
                                        ) : (
                                            <RiFileTextLine className="size-4" />
                                        )}
                                    </Button.Root>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    {project.type === "uxui" ? (
                                        <p>UX/UI</p>
                                    ) : project.type === "dev" ? (
                                        <p>Dev</p>
                                    ) : project.type === "marketing" ? (
                                        <p>Marketing</p>
                                    ) : (
                                        <p>Other</p>
                                    )}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <ProgressBar.Root value={progress} className="h-2" />
                    </div>

                    <div>
                        <div className="flex justify-between gap-2">
                            <DateCard
                                startDate={project.startDate}
                                endDate={project.endDate}
                            />
                            <ContributorsCard
                                contributors={project.projectContributors}
                            />
                        </div>
                        <Divider.Root className="my-2 border-neutral-100" />
                        <div className="flex gap-2 pt-2">
                            <Button.Root
                                className={`w-full`}
                                variant="neutral"
                                mode="stroke"
                                disabled={
                                    project.exclusive404
                                        ? user?.role !== USER_ROLES.MEMBER
                                        : false
                                }
                                onClick={() =>
                                    handleParticipate(
                                        isContributor ? "leave" : "participate"
                                    )
                                }
                            >
                                {isContributor
                                    ? "Leave project"
                                    : "Want to participate?"}
                            </Button.Root>
                            {isContributor && (
                                <Button.Root className="w-full" asChild>
                                    <Link href={`/projects/${project.id}`}>
                                        <RiMessage2Line className="h-4 w-4 mr-2" />
                                        View Discussion
                                    </Link>
                                </Button.Root>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

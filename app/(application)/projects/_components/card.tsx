"use client";

import React, { useRef, useState } from "react";

import {
    RiClockwise2Fill,
    RiGithubLine,
    RiMessage2Line,
    RiDiscordFill,
    RiFileTextLine,
    RiArrowUpFill,
    RiArrowDownFill,
    RiCalendarLine,
    RiUserLine,
} from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import * as Avatar from "@/components/ui/avatar";
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as ProgressBar from "@/components/ui/progress-bar";
import * as Textarea from "@/components/ui/textarea";
import * as Tooltip from "@/components/ui/tooltip";
import { USER_ROLES } from "@/constants/roles";
import { useTRPC } from "@/trpc/client";

import { ProjectStatusCardProps } from "./types";
export function ProjectCard({
    project,
    user,
    isContributor,
}: ProjectStatusCardProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const toggleExpand = () => setIsExpanded((prev) => !prev);
    const contentRef = useRef<HTMLDivElement>(null);

    const now = new Date().getTime();
    const total = project.endDate.getTime() - project.startDate.getTime();
    const elapsed = now - project.startDate.getTime();
    const progress = Math.max(
        0,
        Math.min(100, Math.round((elapsed / total) * 100))
    );
    const trpc = useTRPC();

    const { mutateAsync: storeContributor } = useMutation(
        trpc.project.storeContributor.mutationOptions({
            onSuccess: () => {
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
                        <Button.Root
                            variant="primary"
                            mode="stroke"
                            className="w-full"
                            onClick={toggleExpand}
                        >
                            {isExpanded ? (
                                <RiArrowUpFill className="size-4" />
                            ) : (
                                <RiArrowDownFill className="size-4" />
                            )}
                        </Button.Root>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            height: isExpanded ? "auto" : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="overflow-hidden"
                    >
                        <div ref={contentRef}>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4 pt-2"
                                    >
                                        <div className="flex items-center gap-4 text-sm text-blue-600">
                                            <div className="flex items-center gap-1">
                                                <RiCalendarLine className="h-4 w-4" />
                                                <span>
                                                    Début :{" "}
                                                    <span className="font-medium">
                                                        {project.startDate.toLocaleDateString()}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RiClockwise2Fill className="h-4 w-4" />
                                                <span>
                                                    Fin :{" "}
                                                    <span className="font-medium">
                                                        {project.endDate.toLocaleDateString()}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative text-gray-700 text-sm leading-relaxed mb-2">
                                            <p className="text-gray-700">
                                                Description :
                                            </p>
                                            <Textarea.Root
                                                className="line-clamp-2 disabled:opacity-100 text-gray-700"
                                                value={project.description}
                                                disabled
                                            />
                                            {/* Optionnel : bouton voir plus si description longue */}
                                            {/* <button className="absolute right-0 bottom-0 text-xs text-primary underline bg-gradient-to-l from-white pl-2">Voir plus</button> */}
                                        </div>
                                        <Divider.Root className="my-2 border-neutral-100" />

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm flex items-center">
                                                <RiUserLine className="h-4 w-4 mr-2" />
                                                Contributors
                                            </h4>

                                            {project.projectContributors && (
                                                <div className="flex -space-x-2">
                                                    {project.projectContributors.map(
                                                        (
                                                            contributor,
                                                            index
                                                        ) => (
                                                            <Tooltip.Root
                                                                key={index}
                                                            >
                                                                <Tooltip.Trigger
                                                                    asChild
                                                                >
                                                                    <Avatar.Root className="border-2 border-white size-8">
                                                                        <Avatar.Image
                                                                            src={
                                                                                contributor
                                                                                    .user
                                                                                    .image ||
                                                                                `/placeholder.svg?height=32&width=32&text=${contributor.user.username}`
                                                                            }
                                                                            alt={
                                                                                contributor
                                                                                    .user
                                                                                    .username ||
                                                                                "Contributor"
                                                                            }
                                                                        />
                                                                    </Avatar.Root>
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content>
                                                                    <p className="text-sm">
                                                                        {
                                                                            contributor
                                                                                .user
                                                                                .username
                                                                        }
                                                                    </p>
                                                                </Tooltip.Content>
                                                            </Tooltip.Root>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/*
                                         <div className="space-y-2">
                                            <h4 className="font-medium text-sm">
                                                Skills required
                                            </h4>
                                            {skills &&
                                                skills.map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-gray-600">
                                                            {skill.title}
                                                        </span>
                                                        {skill.completed && (
                                                            <RiCheckFill className="h-4 w-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                        </div> */}
                                        <div className="space-y-2 flex flex-col gap-2">
                                            <Button.Root
                                                className={`w-full`}
                                                variant="neutral"
                                                mode="stroke"
                                                disabled={
                                                    project.exclusive404
                                                        ? user.role !==
                                                          USER_ROLES.MEMBER
                                                        : false
                                                }
                                                onClick={() =>
                                                    handleParticipate(
                                                        isContributor
                                                            ? "leave"
                                                            : "participate"
                                                    )
                                                }
                                            >
                                                {isContributor
                                                    ? "Leave project"
                                                    : "Want to participate?"}
                                            </Button.Root>
                                            {isContributor && (
                                                <Button.Root
                                                    className="w-full"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/projects/${project.id}`}
                                                    >
                                                        <RiMessage2Line className="h-4 w-4 mr-2" />
                                                        View Discussion
                                                    </Link>
                                                </Button.Root>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

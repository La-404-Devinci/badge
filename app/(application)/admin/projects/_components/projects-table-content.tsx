"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";

import * as Badge from "@/components/ui/badge";
import * as Table from "@/components/ui/table";

import type { Project } from "@/db/schema";

import { ProjectActions } from "./project-actions";

interface ProjectsTableContentProps {
  projects: Project[];
}

export function ProjectsTableContent({ projects }: ProjectsTableContentProps) {
  const t = useTranslations("admin.exercises.projects.table");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "review":
        return "orange";
      case "inactive":
        return "gray";
      case "completed":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "uxui":
        return t("types.uxui");
      case "dev":
        return t("types.dev");
      case "marketing":
        return t("types.marketing");
      case "other":
        return t("types.other");
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("statuses.active");
      case "review":
        return t("statuses.review");
      case "inactive":
        return t("statuses.inactive");
      case "completed":
        return t("statuses.completed");
      case "cancelled":
        return t("statuses.cancelled");
      default:
        return status;
    }
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div className="rounded-lg border border-stroke-soft-200 bg-bg-white-0">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t("columns.title")}</Table.Head>
            <Table.Head>{t("columns.type")}</Table.Head>
            <Table.Head>{t("columns.status")}</Table.Head>
            <Table.Head>{t("columns.startDate")}</Table.Head>
            <Table.Head>{t("columns.endDate")}</Table.Head>
            <Table.Head>{t("columns.createdAt")}</Table.Head>
            <Table.Head className="w-12">{t("columns.actions")}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <div className="flex flex-col">
                  <span className="font-medium">{project.title}</span>
                  <span className="text-sm text-text-sub-600">
                    {truncateDescription(project.description)}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge.Root variant="stroke" color="gray">
                  {getTypeLabel(project.type)}
                </Badge.Root>
              </Table.Cell>
              <Table.Cell>
                <Badge.Root variant="filled" color={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge.Root>
              </Table.Cell>
              <Table.Cell>
                {format(new Date(project.startDate), "dd/MM/yyyy", {
                  locale: fr,
                })}
              </Table.Cell>
              <Table.Cell>
                {format(new Date(project.endDate), "dd/MM/yyyy", {
                  locale: fr,
                })}
              </Table.Cell>
              <Table.Cell>
                {format(new Date(project.createdAt), "dd/MM/yyyy", {
                  locale: fr,
                })}
              </Table.Cell>
              <Table.Cell>
                <ProjectActions project={project} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
} 
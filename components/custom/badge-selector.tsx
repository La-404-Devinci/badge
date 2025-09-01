"use client";

import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";

interface BadgeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export function BadgeSelector({
  value,
  onValueChange,
  placeholder,
  hasError = false,
}: BadgeSelectorProps) {
  const t = useTranslations("project.create.projectForm");
  const trpc = useTRPC();

  const { data: badgesData, isLoading, error } = useQuery(
    trpc.badge.listBadgesForProjects.queryOptions()
  );

  const badges = badgesData?.badges || [];

  return (
    <div className="space-y-2">
      <Label.Root>{t("fields.badge")}</Label.Root>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger>
          <Select.Value placeholder={placeholder || t("placeholders.badge")} />
        </Select.Trigger>
        <Select.Content>
          {isLoading && (
            <Select.Item value="loading" disabled>
              {t("loading")}
            </Select.Item>
          )}
          {error && (
            <Select.Item value="error" disabled>
              Erreur de chargement
            </Select.Item>
          )}
          {!isLoading && !error && badges.length === 0 && (
            <Select.Item value="no-badges" disabled>
              Aucun badge disponible
            </Select.Item>
          )}
          {!isLoading && !error && badges.map((badge: any) => (
            <Select.Item key={badge.id} value={badge.id}>
              {badge.displayName}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

import * as Badge from "@/components/ui/badge";
import * as Card from "@/components/custom/card";
import * as ProgressBar from "@/components/ui/progress-bar";

interface UserBadge {
  id: string;
  currentLevel: number;
  currentExp: number;
  totalExp: number;
  expToNextLevel: number;
  lastUpdated: Date;
  badgeType: {
    id: string;
    name: string;
    displayName: string;
    description: string;
    icon: string;
    color: string;
    maxLevel: number;
  };
}

interface UserBadgesProps {
  badges: UserBadge[];
  className?: string;
}

export function UserBadges({ badges, className }: UserBadgesProps) {
  const t = useTranslations("badges");

  if (!badges || badges.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-text-sub-600">{t("noBadges")}</p>
      </div>
    );
  }

  const getBadgeColor = (color: string): "blue" | "green" | "orange" | "purple" | "yellow" | "gray" => {
    const colorMap: Record<string, "blue" | "green" | "orange" | "purple" | "yellow" | "gray"> = {
      blue: "blue",
      green: "green",
      orange: "orange",
      purple: "purple",
      gold: "yellow",
    };
    return colorMap[color] || "gray";
  };

  const getProgressPercentage = (currentExp: number, expToNextLevel: number) => {
    return Math.min((currentExp / expToNextLevel) * 100, 100);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-title-h6 font-bold">{t("title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <Card.Root key={badge.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-${badge.badgeType.color}-100 flex items-center justify-center`}>
                  <span className="text-lg">{badge.badgeType.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {badge.badgeType.displayName}
                  </h4>
                  <p className="text-xs text-text-sub-600">
                    {badge.badgeType.description}
                  </p>
                </div>
              </div>
              <Badge.Root
                variant="filled"
                color={getBadgeColor(badge.badgeType.color)}
                size="small"
              >
                Niveau {badge.currentLevel}
              </Badge.Root>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-sub-600">
                <span>{t("experience")}</span>
                <span>{badge.currentExp} / {badge.expToNextLevel}</span>
              </div>
              <ProgressBar.Root
                value={getProgressPercentage(badge.currentExp, badge.expToNextLevel)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-text-sub-600">
                <span>{t("totalExp")}</span>
                <span>{badge.totalExp}</span>
              </div>
            </div>

            {badge.currentLevel >= badge.badgeType.maxLevel && (
              <div className="mt-3 text-center">
                <Badge.Root
                  variant="light"
                  color="green"
                  size="small"
                >
                  {t("maxLevel")}
                </Badge.Root>
              </div>
            )}
          </Card.Root>
        ))}
      </div>
    </div>
  );
}

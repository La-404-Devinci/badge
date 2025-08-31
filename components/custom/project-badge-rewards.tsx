"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Card from "@/components/custom/card";
import * as Input from "@/components/ui/input";
import * as Select from "@/components/ui/select";
import { RiAddLine, RiCloseLine } from "@remixicon/react";

interface BadgeType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
}

interface BadgeReward {
  badgeTypeName: string;
  expReward: number;
}

interface ProjectBadgeRewardsProps {
  badgeTypes: BadgeType[];
  rewards: BadgeReward[];
  onRewardsChange: (rewards: BadgeReward[]) => void;
  className?: string;
}

export function ProjectBadgeRewards({
  badgeTypes,
  rewards,
  onRewardsChange,
  className,
}: ProjectBadgeRewardsProps) {
  const t = useTranslations("projectBadgeRewards");
  const [localRewards, setLocalRewards] = useState<BadgeReward[]>(rewards);

  useEffect(() => {
    setLocalRewards(rewards);
  }, [rewards]);

  const addReward = () => {
    const newReward: BadgeReward = {
      badgeTypeName: "",
      expReward: 100,
    };
    const updatedRewards = [...localRewards, newReward];
    setLocalRewards(updatedRewards);
    onRewardsChange(updatedRewards);
  };

  const removeReward = (index: number) => {
    const updatedRewards = localRewards.filter((_, i) => i !== index);
    setLocalRewards(updatedRewards);
    onRewardsChange(updatedRewards);
  };

  const updateReward = (index: number, field: keyof BadgeReward, value: string | number) => {
    const updatedRewards = localRewards.map((reward, i) => {
      if (i === index) {
        return { ...reward, [field]: value };
      }
      return reward;
    });
    setLocalRewards(updatedRewards);
    onRewardsChange(updatedRewards);
  };

  const getBadgeTypeByName = (name: string) => {
    return badgeTypes.find(bt => bt.name === name);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-title-h6 font-bold">{t("title")}</h3>
        <Button.Root
          variant="primary"
          mode="stroke"
          size="small"
          onClick={addReward}
        >
          <Button.Icon as={RiAddLine} />
          {t("addReward")}
        </Button.Root>
      </div>

      {localRewards.length === 0 ? (
        <Card.Root className="p-6 text-center">
          <p className="text-text-sub-600">{t("noRewards")}</p>
          <Button.Root
            variant="primary"
            mode="stroke"
            size="small"
            onClick={addReward}
            className="mt-2"
          >
            <Button.Icon as={RiAddLine} />
            {t("addFirstReward")}
          </Button.Root>
        </Card.Root>
      ) : (
        <div className="space-y-3">
          {localRewards.map((reward, index) => {
            const badgeType = getBadgeTypeByName(reward.badgeTypeName);

            return (
              <Card.Root key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Select.Root
                      value={reward.badgeTypeName}
                      onValueChange={(value) => updateReward(index, "badgeTypeName", value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder={t("selectBadge")} />
                      </Select.Trigger>
                      <Select.Content>
                        {badgeTypes.map((bt) => (
                          <Select.Item key={bt.id} value={bt.name}>
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full bg-${bt.color}-100 flex items-center justify-center text-xs`}>
                                {bt.icon}
                              </span>
                              {bt.displayName}
                            </div>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>

                  <div className="w-24">
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          type="number"
                          min="1"
                          value={reward.expReward}
                          onChange={(e) => updateReward(index, "expReward", parseInt(e.target.value) || 0)}
                          placeholder="Exp"
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <Button.Root
                    variant="neutral"
                    mode="ghost"
                    size="small"
                    onClick={() => removeReward(index)}
                  >
                    <Button.Icon as={RiCloseLine} />
                  </Button.Root>
                </div>

                {badgeType && (
                  <div className="mt-2 text-xs text-text-sub-600">
                    {badgeType.description}
                  </div>
                )}
              </Card.Root>
            );
          })}
        </div>
      )}
    </div>
  );
}

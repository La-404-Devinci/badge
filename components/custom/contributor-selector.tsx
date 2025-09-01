"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

import { useTranslations } from "next-intl";

import * as Label from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";

interface ContributorSelectorProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ContributorSelector({
  value,
  onValueChange,
  placeholder,
  disabled = false,
}: ContributorSelectorProps) {
  const t = useTranslations("project.create.projectForm");
  const trpc = useTRPC();
  const [selectedContributors, setSelectedContributors] = useState<string[]>(value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersData, isLoading } = useQuery(
    trpc.auth.listUsers.queryOptions({
      search: null,
      page: 1,
      limit: 100,
    })
  );

  const users = usersData?.users || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContributorChange = (contributorId: string) => {
    const newContributors = selectedContributors.includes(contributorId)
      ? selectedContributors.filter(id => id !== contributorId)
      : [...selectedContributors, contributorId];

    setSelectedContributors(newContributors);
    onValueChange(newContributors);
  };

  const selectedUsers = users.filter(user => selectedContributors.includes(user.id));

  const displayText = disabled
    ? t("placeholders.contributorsDisabled")
    : selectedUsers.length > 0
      ? `${selectedUsers.length} contributeur(s) sélectionné(s)`
      : placeholder || t("placeholders.contributors");

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label.Root>{t("fields.contributors")}</Label.Root>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full rounded-10 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 px-3 py-2 text-left text-paragraph-sm text-text-strong-950 hover:bg-bg-weak-50 focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:cursor-not-allowed"
        >
          {displayText}
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full rounded-10 bg-bg-white-0 shadow-regular-lg ring-1 ring-inset ring-stroke-soft-200 max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-text-sub-600">
                {t("loading")}
              </div>
            )}
            {!isLoading && users.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-bg-weak-50 cursor-pointer"
                onClick={() => handleContributorChange(user.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedContributors.includes(user.id)}
                  onChange={() => handleContributorChange(user.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{user.fullName || user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div className="mt-2 space-y-1">
          <Label.Root className="text-sm font-medium">
            {t("fields.selectedContributors")} ({selectedUsers.length})
          </Label.Root>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-800"
              >
                <span>{user.fullName || user.username}</span>
                <button
                  type="button"
                  onClick={() => handleContributorChange(user.id)}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

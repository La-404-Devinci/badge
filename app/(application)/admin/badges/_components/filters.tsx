"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

import { ClearFiltersButton } from "@/components/custom/table/clear-filters-button";
import * as Input from "@/components/ui/input";
import { PAGES } from "@/constants/pages";

import { adminBadgesParsers } from "../searchParams";

export function Filters() {
  const t = useTranslations("admin.badges.filters");
  const router = useRouter();

  // Query params
  const [search, setSearch] = useQueryState("search", adminBadgesParsers.search);
  const [type, setType] = useQueryState("type", adminBadgesParsers.type);
  const [color, setColor] = useQueryState("color", adminBadgesParsers.color);

  const hasActiveFilters = search || type || color;

  const handleClearFilters = () => {
    router.push(PAGES.ADMIN_BADGES);
  };

  return (
    <div className="flex flex-col gap-4 rounded-20 bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-end">
          {/* Recherche */}
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-label-sm text-text-soft-400">
              {t("search")}
            </label>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  placeholder={t("searchPlaceholder")}
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value || null)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          {/* Filtre par type */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-text-soft-400">
              {t("type")}
            </label>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  placeholder={t("allTypes")}
                  value={type || ""}
                  onChange={(e) => setType(e.target.value || null)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          {/* Filtre par couleur */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-text-soft-400">
              {t("color")}
            </label>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  placeholder={t("allColors")}
                  value={color || ""}
                  onChange={(e) => setColor(e.target.value || null)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>

        {/* Bouton pour effacer les filtres */}
        {hasActiveFilters && (
          <ClearFiltersButton onClick={handleClearFilters} disabled={false} />
        )}
      </div>
    </div>
  );
}

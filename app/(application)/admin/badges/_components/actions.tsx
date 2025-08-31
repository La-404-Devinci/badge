"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import { RiAddLine } from "@remixicon/react";

import { CreateBadgeModal } from "./create-badge-modal";

export function BadgeActions() {
  const t = useTranslations("admin.badges");
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Button.Root
        variant="primary"
        size="medium"
        onClick={() => setShowCreateModal(true)}
      >
        <Button.Icon as={RiAddLine} />
        {t("actions.create")}
      </Button.Root>

      <CreateBadgeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}

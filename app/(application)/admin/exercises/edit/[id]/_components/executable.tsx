import { useCallback, useState } from "react";

import { RiPlayLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExecuteCodeOutput } from "@/server/routers/exercise/mutations";
import { useTRPC } from "@/trpc/client";

interface ExecutableProps {
    code: string;
    call: string;
}

export default function Executable({ code, call }: ExecutableProps) {
    const t = useTranslations("admin.exercises.editor");
    const trpc = useTRPC();

    const [tmpResults, setTmpResults] = useState<ExecuteCodeOutput | null>(
        null
    );

    const { mutateAsync: executeCode } = useMutation(
        trpc.exercise.executeCode.mutationOptions({})
    );

    const handleExecuteCode = useCallback(async () => {
        const result = await executeCode({ code, call });
        setTmpResults(result);
    }, [executeCode, code, call]);

    return (
        <div className="flex gap-2 my-2 items-center">
            <Button.Root
                variant="primary"
                mode="lighter"
                size="xsmall"
                onClick={handleExecuteCode}
            >
                <Button.Icon as={RiPlayLine} />
                {t("buttons.execute")}
            </Button.Root>
            <p
                className={cn("text-label-xs", {
                    "text-green-500": tmpResults?.success,
                    "text-red-500": !tmpResults?.success,
                })}
            >
                {tmpResults?.success ? tmpResults?.result : tmpResults?.error}
            </p>
        </div>
    );
}

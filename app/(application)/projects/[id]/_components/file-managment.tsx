import * as React from "react";

import {
    RiFileTextFill,
    RiCloseLine,
    RiCheckLine,
    RiEyeLine,
    RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";

import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import * as Select from "@/components/ui/select";

const typeFiles = [
    {
        icon: RiFileTextFill,
        label: "github",
        type: "url",
    },
    {
        icon: RiFileTextFill,
        label: "figma",
        type: "url",
    },
    {
        icon: RiFileTextFill,
        label: "word",
        type: "file",
        disabled: true,
    },
];

function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export default function FileManagment() {
    const [selectedType, setSelectedType] = React.useState<string | null>(null);
    const [addedTypes, setAddedTypes] = React.useState<
        Array<{ label: string; type: string; url?: string; saved?: boolean }>
    >([]);
    const [urlErrors, setUrlErrors] = React.useState<Record<string, string>>(
        {}
    );

    const handleAddType = () => {
        if (!selectedType) return;
        const typeObj = typeFiles.find((t) => t.label === selectedType);
        if (!typeObj) return;
        if (addedTypes.some((t) => t.label === selectedType)) return;
        setAddedTypes((prev) => [
            ...prev,
            { label: typeObj.label, type: typeObj.type, url: "", saved: false },
        ]);
        setSelectedType(null);
    };

    const handleUrlChange = (label: string, url: string) => {
        setAddedTypes((prev) =>
            prev.map((t) =>
                t.label === label ? { ...t, url, saved: false } : t
            )
        );
        setUrlErrors((prev) => ({ ...prev, [label]: "" }));
    };

    const handleDeleteType = (label: string) => {
        setAddedTypes((prev) => prev.filter((t) => t.label !== label));
        setUrlErrors((prev) => {
            const copy = { ...prev };
            delete copy[label];
            return copy;
        });
    };

    const handleValidateUrl = (label: string) => {
        setAddedTypes((prev) =>
            prev.map((t) => {
                if (t.label === label) {
                    if (t.type === "url") {
                        if (!t.url || !isValidUrl(t.url)) {
                            setUrlErrors((prev) => ({
                                ...prev,
                                [label]: "URL invalide",
                            }));
                            return { ...t, saved: false };
                        }
                    }
                    return { ...t, saved: true };
                }
                return t;
            })
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <RiFileTextFill className="text-text-sub-600 size-4" />
                <span className="text-sm text-text-sub-600">
                    Gestion des fichiers
                </span>
            </div>

            <div className="w-full max-w-[300px] flex items-center gap-2">
                <Select.Root
                    value={selectedType ?? undefined}
                    onValueChange={setSelectedType}
                >
                    <Select.Trigger>
                        <Select.Value placeholder="Select a file" />
                    </Select.Trigger>
                    <Select.Content>
                        {typeFiles.map((item, index) => (
                            <Select.Item
                                key={index}
                                value={item.label}
                                disabled={item.disabled}
                            >
                                <Select.ItemIcon as={item.icon} />
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                <Button.Root onClick={handleAddType}>
                    Ajouter ce type
                </Button.Root>
            </div>
            <div className="flex flex-col gap-2 max-w-[500px]">
                {addedTypes.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-start gap-2"
                    >
                        <span className="capitalize">{item.label}</span>
                        {item.type === "url" && (
                            <div className="flex gap-2 w-full">
                                <Input.Root>
                                    <Input.Wrapper className="pr-2">
                                        <Input.Input
                                            type="url"
                                            placeholder={`Entrer l'URL de ${item.label}`}
                                            value={item.url ?? ""}
                                            onChange={(e) =>
                                                handleUrlChange(
                                                    item.label,
                                                    e.target.value
                                                )
                                            }
                                            className={`${
                                                item.saved
                                                    ? "bg-background-soft-400 disabled:text-neutral-500"
                                                    : ""
                                            }`}
                                            disabled={item.saved}
                                        />
                                        <div
                                            className={`flex items-center gap-2 ${
                                                item.saved ? "hidden" : ""
                                            }`}
                                        >
                                            <Button.Root
                                                variant="primary"
                                                size="xxsmall"
                                                onClick={() =>
                                                    handleValidateUrl(
                                                        item.label
                                                    )
                                                }
                                                disabled={item.saved}
                                            >
                                                <RiCheckLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                                            </Button.Root>
                                            <Button.Root
                                                variant="neutral"
                                                size="xxsmall"
                                                onClick={() =>
                                                    handleDeleteType(item.label)
                                                }
                                                disabled={item.saved}
                                            >
                                                <RiCloseLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                                            </Button.Root>
                                        </div>
                                    </Input.Wrapper>
                                    {urlErrors[item.label] && (
                                        <span className="text-xs text-red-500 ml-2">
                                            {urlErrors[item.label]}
                                        </span>
                                    )}
                                </Input.Root>
                                {item.saved && item.url && (
                                    <Button.Root asChild>
                                        <Link href={item.url} target="_blank">
                                            <RiEyeLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                                        </Link>
                                    </Button.Root>
                                )}
                            </div>
                        )}
                        {item.type !== "url" && (
                            <Button.Root
                                variant="neutral"
                                size="xxsmall"
                                onClick={() => handleDeleteType(item.label)}
                                disabled={item.saved}
                            >
                                <RiCloseLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                            </Button.Root>
                        )}
                    </div>
                ))}
            </div>

            {addedTypes.filter((t) => t.saved && t.url).length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2">
                        Fichiers enregistrés
                    </h3>
                    <div className="flex flex-col gap-3">
                        {addedTypes
                            .filter((t) => t.saved && t.url)
                            .map((item, index) => (
                                <div
                                    className="flex items-center gap-2"
                                    key={index}
                                >
                                    <Input.Root
                                        key={item.label}
                                        className="max-w-[300px]"
                                    >
                                        <Input.Wrapper>
                                            <RiFileTextFill className="text-gray-400 size-5" />

                                            <Input.Input
                                                value={item.url ?? ""}
                                                disabled
                                                className="w-full text-xs text-gray-500"
                                            />
                                        </Input.Wrapper>
                                    </Input.Root>
                                    <div className="flex items-center gap-2 z-10">
                                        <Button.Root
                                            variant="neutral"
                                            size="xxsmall"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    item.url ?? ""
                                                );
                                            }}
                                        >
                                            <RiFileCopyLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                                        </Button.Root>
                                        <Button.Root
                                            variant="neutral"
                                            size="xxsmall"
                                            asChild
                                        >
                                            <Link
                                                href={item.url ?? ""}
                                                target="_blank"
                                            >
                                                <RiEyeLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
                                            </Link>
                                        </Button.Root>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

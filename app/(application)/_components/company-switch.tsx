"use client";

import * as React from "react";

import { RiCheckLine, RiExpandUpDownLine } from "@remixicon/react";

import * as Avatar from "@/components/ui/avatar";
import * as Dropdown from "@/components/ui/dropdown";
import { cn } from "@/lib/utils/cn";

type Company = {
    value: string;
    name: string;
    description: string;
    logo?: string;
};

const companies: Company[] = [
    {
        value: "synergy",
        name: "Synergy",
        description: "HR Management",
    },
    {
        value: "apex",
        name: "Apex",
        description: "Finance & Banking",
    },
    {
        value: "catalyst",
        name: "Catalyst",
        description: "Marketing & Sales",
    },
];

type CompanyItemProps = {
    company: Company;
    selected: boolean;
    onSelect: (value: string) => void;
};

function CompanyItem({ company, selected, onSelect }: CompanyItemProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(company.value)}
            className="group/item flex w-full cursor-pointer items-center gap-3 rounded-10 p-2 text-left outline-none transition duration-200 ease-out hover:bg-bg-weak-50 focus:outline-none"
        >
            <div className="flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                <Avatar.Root className="size-10" placeholderType="company">
                    {company.logo && <Avatar.Image src={company.logo} alt="" />}
                </Avatar.Root>
            </div>
            <div className="flex-1 space-y-1">
                <div className="text-label-sm">{company.name}</div>
                <div className="text-paragraph-xs text-text-sub-600">
                    {company.description}
                </div>
            </div>
            {selected && <RiCheckLine className="size-5 text-text-sub-600" />}
        </button>
    );
}

export function CompanySwitch({ className }: { className?: string }) {
    const [selectedItem, setSelectedItem] = React.useState(companies[0].value);

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cn(
                    "flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none",
                    className
                )}
            >
                <Avatar.Root className="size-10" placeholderType="company">
                    {/* {companies.find((company) => company.value === selectedItem)?.logo && (
                        <Avatar.Image src={companies.find((company) => company.value === selectedItem)?.logo} alt='' />
                    )} */}
                </Avatar.Root>
                <div
                    className="flex w-[172px] shrink-0 items-center gap-3"
                    data-hide-collapsed
                >
                    <div className="flex-1 space-y-1">
                        <div className="text-label-sm">
                            {
                                companies.find(
                                    (company) => company.value === selectedItem
                                )?.name
                            }
                        </div>
                        <div className="text-paragraph-xs text-text-sub-600">
                            {
                                companies.find(
                                    (company) => company.value === selectedItem
                                )?.description
                            }
                        </div>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
                        <RiExpandUpDownLine className="size-5 text-text-sub-600" />
                    </div>
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content side="right" sideOffset={24} align="start">
                {companies.map((company, i) => (
                    <CompanyItem
                        key={i}
                        company={company}
                        selected={selectedItem === company.value}
                        onSelect={(val) => setSelectedItem(val)}
                    />
                ))}
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

export function CompanySwitchMobile({ className }: { className?: string }) {
    const [selectedItem, setSelectedItem] = React.useState(companies[0].value);

    const company = companies.find((company) => company.value === selectedItem);

    return (
        <Dropdown.Root modal={false}>
            <Dropdown.Trigger
                className={cn(
                    "group flex w-full items-center gap-3 whitespace-nowrap px-4 py-[18px] text-left outline-none focus:outline-none",
                    className
                )}
            >
                <Avatar.Root className="size-11" placeholderType="company">
                    {company?.logo && (
                        <Avatar.Image src={company.logo} alt="" />
                    )}
                </Avatar.Root>
                <div className="flex-1 space-y-1">
                    <div className="text-label-md">{company?.name}</div>
                    <div className="text-paragraph-sm text-text-sub-600">
                        {company?.description}
                    </div>
                </div>
                <div
                    className={cn(
                        "flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs transition duration-200 ease-out",
                        // open
                        "group-data-[state=open]:border-bg-strong-950 group-data-[state=open]:bg-bg-strong-950 group-data-[state=open]:text-text-white-0"
                    )}
                >
                    <RiExpandUpDownLine className="size-5" />
                </div>
            </Dropdown.Trigger>
            <Dropdown.Content
                side="bottom"
                align="end"
                sideOffset={-12}
                alignOffset={16}
                className=""
            >
                {companies.map((company, i) => (
                    <CompanyItem
                        key={i}
                        company={company}
                        selected={selectedItem === company.value}
                        onSelect={(val) => setSelectedItem(val)}
                    />
                ))}
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

"use client";

import * as React from "react";

import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import * as Button from "@/components/ui/button";
import * as DatepickerPrimivites from "@/components/ui/datepicker";
import * as Popover from "@/components/ui/popover";

type SingleDatepickerProps = {
    defaultValue?: DateRange;
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
};

function Datepicker({ value, defaultValue, onChange }: SingleDatepickerProps) {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange | undefined>(
        value ?? defaultValue ?? undefined
    );

    const handleChange = (value: DateRange | undefined) => {
        setRange(value);
        onChange?.(value);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    disabled={true}
                    className="disabled:text-neutral-900"
                >
                    {range?.from ? (
                        <>
                            {format(range.from, "LLL dd, y")}
                            {range.to && (
                                <> - {format(range.to, "LLL dd, y")}</>
                            )}
                        </>
                    ) : (
                        <span>Select a range</span>
                    )}
                </Button.Root>
            </Popover.Trigger>
            <Popover.Content className="p-0" showArrow={false}>
                <DatepickerPrimivites.Calendar
                    mode="range"
                    selected={range}
                    onSelect={handleChange}
                />
            </Popover.Content>
        </Popover.Root>
    );
}

export function DateCard({
    startDate,
    endDate,
}: {
    startDate: Date;
    endDate: Date;
}) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        startDate && endDate
            ? {
                  from: startDate,
                  to: endDate,
              }
            : undefined
    );

    return <Datepicker value={date} onChange={setDate} />;
}

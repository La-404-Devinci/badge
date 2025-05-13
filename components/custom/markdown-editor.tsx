import * as TextArea from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { MarkdownRenderer } from "../markdown-renderer";
import ResponsiveDivider from "./responsive-divider";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
    id?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder,
    rows,
    className,
    id,
}: MarkdownEditorProps) {
    return (
        <div
            className={cn(
                "p-2 border rounded-md border-bg-soft-200 shadow-regular-sm flex flex-col md:flex-row gap-2",
                className
            )}
        >
            <div className="flex-1">
                <TextArea.Root
                    rows={
                        rows ??
                        Math.ceil(value.length / 60) + value.split("\n").length
                    }
                    id={id}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    className="p-0"
                    containerClassName="shadow-none ring-0"
                    placeholder={placeholder}
                />
            </div>

            <ResponsiveDivider />

            <div className="flex-1">
                <MarkdownRenderer>{value}</MarkdownRenderer>
            </div>
        </div>
    );
}

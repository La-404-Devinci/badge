/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo } from "react";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import * as LinkButton from "@/components/ui/link-button";
import { cn } from "@/lib/utils/cn";

interface MarkdownProps {
    children: string;
    className?: string;
}

const PureMarkdownRenderer = ({ children, className }: MarkdownProps) => {
    const components: Components = {
        h1: ({ children, ...props }: any) => (
            <h1 className="text-title-h5 mb-6" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }: any) => (
            <h2 className="text-title-h6 mb-5" {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }: any) => (
            <h3 className="text-label-md mb-4" {...props}>
                {children}
            </h3>
        ),
        p: ({ children, ...props }: any) => (
            <p className="text-paragraph-sm mb-4" {...props}>
                {children}
            </p>
        ),
        code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
                return (
                    <pre
                        className={cn(
                            "text-paragraph-sm w-full overflow-x-auto p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg my-4",
                            className
                        )}
                        {...props}
                    >
                        <code className={match[1]}>{children}</code>
                    </pre>
                );
            }
            return (
                <code
                    className="text-paragraph-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md"
                    {...props}
                >
                    {children}
                </code>
            );
        },
        ul: ({ children, ...props }) => (
            <ul
                className="list-disc list-outside ml-4 space-y-2 mb-4"
                {...props}
            >
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol
                className="list-decimal list-outside ml-4 space-y-2 mb-4"
                {...props}
            >
                {children}
            </ol>
        ),
        li: ({ children, ...props }) => (
            <li className="text-base leading-6" {...props}>
                {children}
            </li>
        ),
        strong: ({ children, ...props }) => (
            <strong className="font-semibold" {...props}>
                {children}
            </strong>
        ),
        a: ({ children, ...props }: any) => (
            <LinkButton.Root
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                {...props}
            >
                {children}
            </LinkButton.Root>
        ),
        blockquote: ({ children, ...props }) => (
            <blockquote
                className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 my-4 italic"
                {...props}
            >
                {children}
            </blockquote>
        ),
        table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
                <table
                    className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700"
                    {...props}
                >
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
        tbody: ({ children, ...props }) => (
            <tbody
                className="divide-y divide-zinc-200 dark:divide-zinc-700"
                {...props}
            >
                {children}
            </tbody>
        ),
        tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
        th: ({ children, ...props }) => (
            <th
                className="px-3 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                {...props}
            >
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td
                className="px-3 py-2 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100"
                {...props}
            >
                {children}
            </td>
        ),
    };

    return (
        <div className={cn("max-w-none", className)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    );
};

export const MarkdownRenderer = memo(
    PureMarkdownRenderer,
    (prevProps, nextProps) => {
        return prevProps.children === nextProps.children;
    }
);

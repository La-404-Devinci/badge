import { memo } from "react";

import { RiCloseLine, RiSearch2Line } from "@remixicon/react";
import isEqual from "fast-deep-equal";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Input from "@/components/ui/input";

const SearchLoader = memo(
    () => (
        <div className="flex size-5 shrink-0 select-none items-center justify-center">
            <StaggeredFadeLoader variant="muted" spacing="tight" />
        </div>
    ),
    () => true
);

SearchLoader.displayName = "SearchLoader";

const SearchIcon = memo(
    ({ isSearching }: { isSearching: boolean }) => {
        if (isSearching) {
            return <SearchLoader />;
        }
        return <Input.Icon as={RiSearch2Line} />;
    },
    (prev, next) => prev.isSearching === next.isSearching
);

SearchIcon.displayName = "SearchIcon";

interface SearchInputProps {
    value: string;
    isSearching: boolean;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    className?: string;
    size?: "medium" | "small" | "xsmall";
}

const SearchInput = memo(
    ({
        value,
        isSearching,
        placeholder,
        onChange,
        onClear,
        className,
        size = "medium",
    }: SearchInputProps) => {
        return (
            <Input.Root className={className} size={size}>
                <Input.Wrapper>
                    <SearchIcon isSearching={isSearching} />
                    <Input.Input
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                    {value && (
                        <Input.Icon
                            as="button"
                            type="button"
                            onClick={onClear}
                            className="cursor-pointer hover:text-text-strong-950"
                        >
                            <RiCloseLine className="size-5" />
                        </Input.Icon>
                    )}
                </Input.Wrapper>
            </Input.Root>
        );
    },
    (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

SearchInput.displayName = "SearchInput";

export { SearchIcon, SearchInput, SearchLoader };

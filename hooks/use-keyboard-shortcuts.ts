import { useEffect, useCallback, useRef } from "react";

export type KeyboardShortcut = {
    /**
     * The key or keys to listen for
     * Can be a single key (e.g., "e") or key combination (e.g., "ctrl+s")
     */
    key: string;
    /**
     * The action to execute when the shortcut is triggered
     */
    action: () => void;
    /**
     * Whether to prevent the default browser action
     * @default true
     */
    preventDefault?: boolean;
    /**
     * Whether to stop event propagation
     * @default false
     */
    stopPropagation?: boolean;
};

export type KeyboardShortcutsOptions = {
    /**
     * Enable or disable all shortcuts
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether shortcuts should only trigger when an input element is not focused
     * @default true
     */
    ignoreInputs?: boolean;
    /**
     * Optional element to attach the event listener to
     * @default window
     */
    target?: typeof window | HTMLElement | null;
};

/**
 * Hook to handle keyboard shortcuts
 *
 * @example
 * ```tsx
 * const shortcuts = useKeyboardShortcuts([
 *   { key: "e", action: () => console.log("Edit triggered") },
 *   { key: "escape", action: handleCancel },
 *   { key: "ctrl+s", action: handleSave },
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcut[],
    options: KeyboardShortcutsOptions = {}
) {
    const {
        enabled = true,
        ignoreInputs = true,
        target = typeof window !== "undefined" ? window : null,
    } = options;

    const shortcutsRef = useRef(shortcuts);

    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            if (
                ignoreInputs &&
                (event.target instanceof HTMLInputElement ||
                    event.target instanceof HTMLTextAreaElement ||
                    (event.target instanceof HTMLElement &&
                        event.target.isContentEditable))
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const hasCtrl = event.ctrlKey;
            const hasAlt = event.altKey;
            const hasShift = event.shiftKey;
            const hasMeta = event.metaKey;

            for (const shortcut of shortcutsRef.current) {
                const shortcutKey = shortcut.key.toLowerCase();

                if (shortcutKey.includes("+")) {
                    const parts = shortcutKey.split("+").map((p) => p.trim());
                    const ctrlRequired = parts.includes("ctrl");
                    const altRequired = parts.includes("alt");
                    const shiftRequired = parts.includes("shift");
                    const metaRequired =
                        parts.includes("meta") || parts.includes("cmd");

                    const actualKey = parts.filter(
                        (p) =>
                            !["ctrl", "alt", "shift", "meta", "cmd"].includes(p)
                    )[0];

                    if (
                        ctrlRequired === hasCtrl &&
                        altRequired === hasAlt &&
                        shiftRequired === hasShift &&
                        metaRequired === hasMeta &&
                        (actualKey === key ||
                            (actualKey === "escape" && key === "escape"))
                    ) {
                        if (shortcut.preventDefault !== false) {
                            event.preventDefault();
                        }
                        if (shortcut.stopPropagation) {
                            event.stopPropagation();
                        }
                        shortcut.action();
                        return;
                    }
                } else if (
                    shortcutKey === key ||
                    (shortcutKey === "escape" && key === "escape") ||
                    (shortcutKey === "esc" && key === "escape")
                ) {
                    if (shortcut.preventDefault !== false) {
                        event.preventDefault();
                    }
                    if (shortcut.stopPropagation) {
                        event.stopPropagation();
                    }
                    shortcut.action();
                    return;
                }
            }
        },
        [enabled, ignoreInputs]
    );

    useEffect(() => {
        if (!target) return;
        target.addEventListener("keydown", handleKeyDown as EventListener);
        return () => {
            target.removeEventListener(
                "keydown",
                handleKeyDown as EventListener
            );
        };
    }, [target, handleKeyDown]);

    return {
        enabled,
        triggerShortcut: (key: string) => {
            const shortcut = shortcuts.find(
                (s) => s.key.toLowerCase() === key.toLowerCase()
            );
            if (shortcut) {
                shortcut.action();
                return true;
            }
            return false;
        },
    };
}

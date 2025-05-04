import * as React from "react";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils/cn";

// Context to allow children to access island state
type IslandContextType = {
    count?: number;
};

const IslandContext = React.createContext<IslandContextType>({});

export const useIslandContext = () => React.useContext(IslandContext);

type IslandProps = {
    /**
     * Show the island
     */
    show: boolean;
    /**
     * Selected items count to display in badge (optional)
     */
    count?: number;
    /**
     * Direct className for positioning (recommended over position prop)
     */
    positionClassName?: string;
    /**
     * Additional className for the motion div
     */
    className?: string;
    /**
     * Children elements
     */
    children: React.ReactNode;
};

export function Island({
    children,
    show,
    count,
    positionClassName,
    className,
}: IslandProps) {
    return (
        <AnimatePresence>
            {show && (
                <div
                    className={cn(
                        "fixed z-50 bottom-6 left-1/2 -translate-x-1/2",
                        positionClassName
                    )}
                >
                    <motion.div
                        className={cn(
                            "rounded-[18px] bg-bg-weak-50 border border-stroke-soft-200 shadow-lg",
                            className
                        )}
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.98,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                            mass: 0.8,
                            duration: 0.08,
                        }}
                    >
                        <IslandContext.Provider value={{ count }}>
                            {children}
                        </IslandContext.Provider>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

Island.displayName = "Island";

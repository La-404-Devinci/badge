import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "@/lib/utils";

// Card Root
interface CardRootProps extends ComponentPropsWithoutRef<"div"> { }

const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm",
        className
      )}
      {...props}
    />
  )
);
CardRoot.displayName = "CardRoot";

// Card Header
interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
interface CardTitleProps extends ComponentPropsWithoutRef<"h3"> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
interface CardDescriptionProps extends ComponentPropsWithoutRef<"p"> { }

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-neutral-600", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// Card Content
interface CardContentProps extends ComponentPropsWithoutRef<"div"> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends ComponentPropsWithoutRef<"div"> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Export the Card components
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
};

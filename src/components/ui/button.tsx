import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(15,93,72,0.55)] ring-1 ring-inset ring-white/10 hover:-translate-y-px hover:bg-primary/95 hover:shadow-[0_14px_28px_-10px_rgba(15,93,72,0.6)] active:translate-y-0 active:shadow-[0_6px_14px_-8px_rgba(15,93,72,0.5)]",
        accent:
          "bg-[linear-gradient(180deg,var(--gold-1),var(--accent)_55%,var(--gold-3))] text-accent-foreground shadow-[0_8px_20px_-8px_rgba(143,107,31,0.6)] ring-1 ring-inset ring-white/25 hover:-translate-y-px hover:brightness-[1.04] hover:shadow-[0_14px_28px_-10px_rgba(143,107,31,0.65)] active:translate-y-0",
        outline:
          "border border-accent/30 bg-card text-foreground shadow-sm hover:-translate-y-px hover:border-accent/70 hover:bg-accent/5 hover:shadow-md active:translate-y-0",
        ghost: "text-foreground/80 hover:bg-accent/10 hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

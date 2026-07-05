import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground ring-1 ring-inset ring-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-3px_7px_-2px_rgba(0,0,0,0.28),0_10px_22px_-8px_rgba(15,93,72,0.55)] hover:-translate-y-px hover:bg-primary/95 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.26),inset_0_-3px_7px_-2px_rgba(0,0,0,0.3),0_16px_30px_-10px_rgba(15,93,72,0.6)] active:translate-y-0 active:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.32),0_4px_10px_-6px_rgba(15,93,72,0.5)]",
        accent:
          "bg-[linear-gradient(180deg,var(--gold-1),var(--accent)_55%,var(--gold-3))] text-accent-foreground ring-1 ring-inset ring-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),inset_0_-3px_7px_-2px_rgba(120,80,10,0.45),0_10px_22px_-8px_rgba(151,111,28,0.55)] hover:-translate-y-px hover:brightness-[1.04] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_-3px_7px_-2px_rgba(120,80,10,0.5),0_16px_30px_-10px_rgba(151,111,28,0.6)] active:translate-y-0 active:shadow-[inset_0_2px_6px_0_rgba(120,80,10,0.5)]",
        outline:
          "border border-accent/40 bg-card text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_2px_6px_-3px_rgba(33,29,23,0.18)] hover:-translate-y-px hover:border-accent/70 hover:bg-accent/5 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_10px_20px_-9px_rgba(151,111,28,0.4)] active:translate-y-0 active:shadow-[inset_0_2px_5px_0_rgba(151,111,28,0.18)]",
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

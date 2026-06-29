"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "brand-gradient text-white shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:brightness-110",
        secondary:
          "bg-elevated text-fg hover:bg-card-hover border border-border",
        ghost:
          "text-fg-muted hover:text-fg hover:bg-elevated",
        danger:
          "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
        outline:
          "border border-border bg-transparent text-fg hover:bg-elevated",
        link:
          "text-brand underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:  "h-7  px-2.5 text-xs  gap-1   rounded-lg",
        sm:  "h-8  px-3   text-sm  gap-1.5 rounded-lg",
        md:  "h-10 px-4   text-sm  gap-2",
        lg:  "h-12 px-5   text-base gap-2",
        xl:  "h-14 px-6   text-base gap-2",
        icon: "h-10 w-10  text-sm  rounded-xl p-0",
        "icon-sm": "h-8 w-8 text-xs rounded-lg p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
)

Button.displayName = "Button"

export { buttonVariants }

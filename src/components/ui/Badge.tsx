import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default:      "bg-elevated text-fg-muted border border-border",
        brand:        "bg-brand/10 text-brand border border-brand/20",
        success:      "bg-success/10 text-success border border-success/20",
        warning:      "bg-warning/10 text-warning border border-warning/20",
        danger:       "bg-danger/10 text-danger border border-danger/20",
        beginner:     "bg-rank-beginner/10 text-rank-beginner border border-rank-beginner/20",
        novice:       "bg-rank-novice/10 text-rank-novice border border-rank-novice/20",
        intermediate: "bg-rank-intermediate/10 text-rank-intermediate border border-rank-intermediate/20",
        advanced:     "bg-rank-advanced/10 text-rank-advanced border border-rank-advanced/20",
        elite:        "bg-rank-elite/10 text-rank-elite border border-rank-elite/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { badgeVariants }

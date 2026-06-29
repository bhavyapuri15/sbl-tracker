import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, icon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-fg"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted">
              {icon}
            </span>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-border bg-elevated px-3.5 py-2 text-sm text-fg placeholder:text-fg-subtle",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-danger focus:ring-danger",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-fg-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

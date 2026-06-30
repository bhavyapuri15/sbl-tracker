"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  snapTo?: "half" | "full"
}

export function Sheet({ open, onClose, title, children, className, snapTo = "half" }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-card border-t border-border",
              "flex flex-col",
              snapTo === "full" ? "max-h-[92dvh]" : "max-h-[80dvh]",
              className
            )}
          >
            <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <h2 className="text-base font-semibold text-fg">{title}</h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

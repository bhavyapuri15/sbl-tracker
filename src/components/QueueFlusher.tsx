"use client"

import { useQueueFlush } from "@/hooks/useQueueFlush"

export function QueueFlusher() {
  useQueueFlush()
  return null
}

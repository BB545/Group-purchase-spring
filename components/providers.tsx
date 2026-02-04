"use client"

import { AuthProvider } from "@/lib/auth-context"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  console.log("[v0] Providers component rendering")
  return <AuthProvider>{children}</AuthProvider>
}

"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { store } from "./store"

export interface AuthUser {
  email: string
  nickname: string
  role: "USER" | "ADMIN"
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => void
  register: (email: string, password: string, nickname: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("[v0] AuthProvider rendering")
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem("currentUser")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    const foundUser = store.loginUser(email, password)
    const authUser: AuthUser = {
      email: foundUser.email,
      nickname: foundUser.nickname,
      role: foundUser.role,
    }
    setUser(authUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(authUser))
    }
  }

  const register = (email: string, password: string, nickname: string) => {
    store.registerUser(email, password, nickname)
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

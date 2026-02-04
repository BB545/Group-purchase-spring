"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingBag, User, LogOut, Package, ClipboardList, LayoutDashboard } from "lucide-react"

export function Header() {
  console.log("[v0] Header rendering")
  const { user, logout, isLoading } = useAuth()
  console.log("[v0] Header - user:", user, "isLoading:", isLoading)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">공동구매</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            상품 목록
          </Link>
          {user && (
            <Link href="/reservations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              내 예약
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              관리자
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/products" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    상품 목록
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reservations" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    내 예약
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        관리자 대시보드
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { store, type Reservation } from "@/lib/store"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ClipboardList, Package, X, Loader2, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const STATUS_CONFIG = {
  WAITING: {
    label: "결제 대기",
    icon: Clock,
    variant: "secondary" as const,
  },
  CONFIRMED: {
    label: "확정",
    icon: CheckCircle,
    variant: "default" as const,
  },
  OUT_OF_STOCK: {
    label: "재고 부족",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  CANCELLED: {
    label: "취소됨",
    icon: XCircle,
    variant: "outline" as const,
  },
}

function ReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setReservations(store.getMyReservations(user.email))
      const unsubscribe = store.subscribe(() => {
        setReservations(store.getMyReservations(user.email))
      })
      return unsubscribe
    }
  }, [user])

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const handleCancelReservation = (reservationId: number) => {
    if (!user) return

    setCancellingId(reservationId)
    try {
      store.cancelReservation(reservationId, user.email)
      toast({
        title: "예약 취소 완료",
        description: "예약이 성공적으로 취소되었습니다.",
      })
    } catch (error) {
      toast({
        title: "취소 실패",
        description: error instanceof Error ? error.message : "예약 취소에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setCancellingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statusCounts = {
    all: reservations.length,
    WAITING: reservations.filter((r) => r.status === "WAITING").length,
    CONFIRMED: reservations.filter((r) => r.status === "CONFIRMED").length,
    CANCELLED: reservations.filter((r) => r.status === "CANCELLED").length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">내 예약</h1>
          <p className="text-muted-foreground mt-1">예약 현황을 확인하고 관리하세요</p>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter("all")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">전체</p>
                  <p className="text-2xl font-bold">{statusCounts.all}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter("WAITING")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">결제 대기</p>
                  <p className="text-2xl font-bold">{statusCounts.WAITING}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter("CONFIRMED")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">확정</p>
                  <p className="text-2xl font-bold">{statusCounts.CONFIRMED}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter("CANCELLED")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">취소됨</p>
                  <p className="text-2xl font-bold">{statusCounts.CANCELLED}</p>
                </div>
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>예약 목록</CardTitle>
                <CardDescription>
                  {filteredReservations.length}개의 예약
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="WAITING">결제 대기</SelectItem>
                  <SelectItem value="CONFIRMED">확정</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">재고 부족</SelectItem>
                  <SelectItem value="CANCELLED">취소됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">예약이 없습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  아직 예약한 상품이 없습니다. 상품을 둘러보세요!
                </p>
                <Button asChild>
                  <Link href="/products">상품 보러가기</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>예약 ID</TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead className="text-center">수량</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>예약일</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => {
                      const config = STATUS_CONFIG[reservation.status]
                      const StatusIcon = config.icon

                      return (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">#{reservation.id}</TableCell>
                          <TableCell>
                            <Link
                              href={`/products/${reservation.productId}`}
                              className="hover:underline text-primary"
                            >
                              {reservation.productName}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">{reservation.quantity}개</TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(reservation.createdAt).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {reservation.status === "WAITING" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    disabled={cancellingId === reservation.id}
                                  >
                                    {cancellingId === reservation.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                    <span className="ml-1">취소</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>예약을 취소하시겠습니까?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      이 작업은 되돌릴 수 없습니다. 예약이 취소되면 다시 예약해야 합니다.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>아니요</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelReservation(reservation.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      예, 취소합니다
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ReservationsPage() {
  return <ReservationsContent />
}

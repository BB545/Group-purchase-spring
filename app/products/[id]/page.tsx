"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createReservation, type Product } from "@/lib/api"
import { ArrowLeft, Package, Calendar, Loader2, Plus, Minus, ShoppingCart, AlertTriangle } from "lucide-react"

// 데모용 상품 데이터
const DEMO_PRODUCTS: Record<string, Product> = {
  "1": {
    id: 1,
    productName: "프리미엄 무선 이어폰",
    totalStock: 100,
    remainStock: 45,
    createdAt: "2026-01-15T10:00:00",
    updatedAt: "2026-02-01T14:30:00",
  },
  "2": {
    id: 2,
    productName: "스마트 워치 Pro",
    totalStock: 50,
    remainStock: 12,
    createdAt: "2026-01-20T09:00:00",
    updatedAt: "2026-02-02T11:00:00",
  },
  "3": {
    id: 3,
    productName: "휴대용 블루투스 스피커",
    totalStock: 200,
    remainStock: 180,
    createdAt: "2026-01-25T15:00:00",
    updatedAt: "2026-02-03T16:00:00",
  },
  "4": {
    id: 4,
    productName: "무선 충전 패드",
    totalStock: 150,
    remainStock: 0,
    createdAt: "2026-01-28T12:00:00",
    updatedAt: "2026-02-04T10:00:00",
  },
  "5": {
    id: 5,
    productName: "노이즈 캔슬링 헤드폰",
    totalStock: 80,
    remainStock: 35,
    createdAt: "2026-02-01T08:00:00",
    updatedAt: "2026-02-04T09:00:00",
  },
  "6": {
    id: 6,
    productName: "미니 프로젝터",
    totalStock: 30,
    remainStock: 8,
    createdAt: "2026-02-02T14:00:00",
    updatedAt: "2026-02-04T15:00:00",
  },
}

function ProductDetailContent({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const product = DEMO_PRODUCTS[productId]

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">상품을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 상품이 존재하지 않습니다.</p>
            <Button asChild>
              <Link href="/products">상품 목록으로</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const soldPercentage = ((product.totalStock - product.remainStock) / product.totalStock) * 100
  const isOutOfStock = product.remainStock === 0
  const isLowStock = product.remainStock <= 10 && product.remainStock > 0

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.remainStock) {
      setQuantity(newQuantity)
    }
  }

  const handleReservation = async () => {
    if (!user || !token) {
      toast({
        title: "로그인 필요",
        description: "예약하려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    try {
      await createReservation(token, product.id, quantity)
      toast({
        title: "예약 완료",
        description: "예약 요청이 완료되었습니다. 결제 대기 상태입니다.",
      })
      router.push("/reservations")
    } catch (error) {
      toast({
        title: "예약 실패",
        description: error instanceof Error ? error.message : "예약에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            상품 목록
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{product.productName}</CardTitle>
                  <CardDescription className="mt-2">
                    상품 ID: {product.id}
                  </CardDescription>
                </div>
                <Badge variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "default"}>
                  {isOutOfStock ? "품절" : isLowStock ? "마감임박" : "판매중"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">총 재고</p>
                  <p className="text-2xl font-bold">{product.totalStock}개</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">남은 수량</p>
                  <p className={`text-2xl font-bold ${isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : ""}`}>
                    {product.remainStock}개
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">판매 현황</span>
                  <span className="font-medium">
                    {Math.round(soldPercentage)}% 판매됨
                  </span>
                </div>
                <Progress value={soldPercentage} className="h-3" />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>등록일: {new Date(product.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>

              {isLowStock && !isOutOfStock && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 text-warning rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">재고가 얼마 남지 않았습니다. 서둘러 예약하세요!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reservation Form */}
          <Card>
            <CardHeader>
              <CardTitle>예약하기</CardTitle>
              <CardDescription>
                원하는 수량을 선택하고 예약을 진행하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isOutOfStock ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    현재 품절된 상품입니다
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    재입고 시 알림을 받으시려면 로그인해주세요.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>수량</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val) && val >= 1 && val <= product.remainStock) {
                            setQuantity(val)
                          }
                        }}
                        className="w-20 text-center"
                        min={1}
                        max={product.remainStock}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.remainStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      최대 {product.remainStock}개까지 예약 가능
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">예약 수량</span>
                      <span className="font-semibold">{quantity}개</span>
                    </div>
                  </div>

                  {user ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleReservation}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          예약 처리 중...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          예약하기
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button className="w-full" size="lg" asChild>
                        <Link href="/login">로그인 후 예약</Link>
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        예약하려면 로그인이 필요합니다
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <AuthProvider>
      <ProductDetailContent productId={resolvedParams.id} />
    </AuthProvider>
  )
}

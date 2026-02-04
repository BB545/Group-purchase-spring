"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { store, type Product, type Reservation } from "@/lib/store"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react"

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

function AdminContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({ productName: "", totalStock: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setProducts(store.getProducts())
    setReservations(store.getAllReservations())
    
    const unsubscribe = store.subscribe(() => {
      setProducts(store.getProducts())
      setReservations(store.getAllReservations())
    })
    return unsubscribe
  }, [])

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const handleCreateProduct = () => {
    if (!productForm.productName || !productForm.totalStock) return

    setIsSubmitting(true)
    try {
      store.createProduct(productForm.productName, parseInt(productForm.totalStock))
      setProductForm({ productName: "", totalStock: "" })
      setIsCreateDialogOpen(false)
      toast({
        title: "상품 등록 완료",
        description: "새 상품이 등록되었습니다.",
      })
    } catch (error) {
      toast({
        title: "등록 실패",
        description: error instanceof Error ? error.message : "상품 등록에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduct = () => {
    if (!editingProduct || !productForm.productName || !productForm.totalStock) return

    setIsSubmitting(true)
    try {
      store.updateProduct(editingProduct.id, productForm.productName, parseInt(productForm.totalStock))
      setEditingProduct(null)
      setProductForm({ productName: "", totalStock: "" })
      toast({
        title: "상품 수정 완료",
        description: "상품 정보가 수정되었습니다.",
      })
    } catch (error) {
      toast({
        title: "수정 실패",
        description: error instanceof Error ? error.message : "상품 수정에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = (productId: number) => {
    try {
      store.deleteProduct(productId)
      toast({
        title: "상품 삭제 완료",
        description: "상품이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: error instanceof Error ? error.message : "상품 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleConfirmReservation = (reservationId: number) => {
    try {
      store.confirmReservation(reservationId)
      toast({
        title: "예약 확정 완료",
        description: "예약이 확정되었습니다.",
      })
    } catch (error) {
      toast({
        title: "확정 실패",
        description: error instanceof Error ? error.message : "예약 확정에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      productName: product.productName,
      totalStock: product.totalStock.toString(),
    })
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

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">접근 권한이 없습니다</h2>
            <p className="text-muted-foreground mb-4">관리자만 접근할 수 있는 페이지입니다.</p>
            <Button onClick={() => router.push("/products")}>상품 목록으로</Button>
          </div>
        </main>
      </div>
    )
  }

  // 통계 계산
  const totalProducts = products.length
  const totalSold = products.reduce((sum, p) => sum + (p.totalStock - p.remainStock), 0)
  const totalReservations = reservations.length
  const waitingReservations = reservations.filter((r) => r.status === "WAITING").length

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">상품과 예약을 관리하세요</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 상품</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 판매</p>
                  <p className="text-2xl font-bold">{totalSold}개</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 예약</p>
                  <p className="text-2xl font-bold">{totalReservations}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">대기 중</p>
                  <p className="text-2xl font-bold">{waitingReservations}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              예약 관리
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>상품 목록</CardTitle>
                    <CardDescription>{products.length}개의 상품</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        상품 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 상품 등록</DialogTitle>
                        <DialogDescription>
                          새로운 공동구매 상품을 등록하세요.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="create-name">상품명</Label>
                          <Input
                            id="create-name"
                            placeholder="상품명을 입력하세요"
                            value={productForm.productName}
                            onChange={(e) =>
                              setProductForm({ ...productForm, productName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="create-stock">재고 수량</Label>
                          <Input
                            id="create-stock"
                            type="number"
                            placeholder="재고 수량을 입력하세요"
                            value={productForm.totalStock}
                            onChange={(e) =>
                              setProductForm({ ...productForm, totalStock: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleCreateProduct}
                          disabled={isSubmitting || !productForm.productName || !productForm.totalStock}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              등록 중...
                            </>
                          ) : (
                            "등록"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>상품명</TableHead>
                        <TableHead className="text-center">총 재고</TableHead>
                        <TableHead className="text-center">남은 재고</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">#{product.id}</TableCell>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell className="text-center">{product.totalStock}개</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                product.remainStock === 0
                                  ? "text-destructive font-medium"
                                  : product.remainStock <= 10
                                  ? "text-orange-500 font-medium"
                                  : ""
                              }
                            >
                              {product.remainStock}개
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog
                                open={editingProduct?.id === product.id}
                                onOpenChange={(open) => {
                                  if (!open) {
                                    setEditingProduct(null)
                                    setProductForm({ productName: "", totalStock: "" })
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(product)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>상품 수정</DialogTitle>
                                    <DialogDescription>
                                      상품 정보를 수정하세요.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">상품명</Label>
                                      <Input
                                        id="edit-name"
                                        value={productForm.productName}
                                        onChange={(e) =>
                                          setProductForm({ ...productForm, productName: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-stock">재고 수량</Label>
                                      <Input
                                        id="edit-stock"
                                        type="number"
                                        value={productForm.totalStock}
                                        onChange={(e) =>
                                          setProductForm({ ...productForm, totalStock: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleUpdateProduct} disabled={isSubmitting}>
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          수정 중...
                                        </>
                                      ) : (
                                        "수정"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      이 작업은 되돌릴 수 없습니다. 상품이 영구적으로 삭제됩니다.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      삭제
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>전체 예약 목록</CardTitle>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>예약 ID</TableHead>
                        <TableHead>사용자</TableHead>
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
                            <TableCell>{reservation.userEmail}</TableCell>
                            <TableCell>{reservation.productName}</TableCell>
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
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {reservation.status === "WAITING" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmReservation(reservation.id)}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  확정
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return <AdminContent />
}

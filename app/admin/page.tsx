"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
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
import { createProduct, updateProduct, deleteProduct, type Product, type Reservation } from "@/lib/api"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react"

// 데모용 상품 데이터
const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    productName: "프리미엄 무선 이어폰",
    totalStock: 100,
    remainStock: 45,
    createdAt: "2026-01-15T10:00:00",
    updatedAt: "2026-02-01T14:30:00",
  },
  {
    id: 2,
    productName: "스마트 워치 Pro",
    totalStock: 50,
    remainStock: 12,
    createdAt: "2026-01-20T09:00:00",
    updatedAt: "2026-02-02T11:00:00",
  },
  {
    id: 3,
    productName: "휴대용 블루투스 스피커",
    totalStock: 200,
    remainStock: 180,
    createdAt: "2026-01-25T15:00:00",
    updatedAt: "2026-02-03T16:00:00",
  },
  {
    id: 4,
    productName: "무선 충전 패드",
    totalStock: 150,
    remainStock: 0,
    createdAt: "2026-01-28T12:00:00",
    updatedAt: "2026-02-04T10:00:00",
  },
  {
    id: 5,
    productName: "노이즈 캔슬링 헤드폰",
    totalStock: 80,
    remainStock: 35,
    createdAt: "2026-02-01T08:00:00",
    updatedAt: "2026-02-04T09:00:00",
  },
  {
    id: 6,
    productName: "미니 프로젝터",
    totalStock: 30,
    remainStock: 8,
    createdAt: "2026-02-02T14:00:00",
    updatedAt: "2026-02-04T15:00:00",
  },
]

// 데모용 전체 예약 데이터
const DEMO_ALL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    userEmail: "user1@example.com",
    productId: 1,
    quantity: 2,
    status: "WAITING",
    createdAt: "2026-02-04T10:30:00",
  },
  {
    id: 2,
    userEmail: "user2@example.com",
    productId: 2,
    quantity: 1,
    status: "CONFIRMED",
    createdAt: "2026-02-03T14:00:00",
  },
  {
    id: 3,
    userEmail: "user1@example.com",
    productId: 5,
    quantity: 3,
    status: "WAITING",
    createdAt: "2026-02-03T09:15:00",
  },
  {
    id: 4,
    userEmail: "user3@example.com",
    productId: 3,
    quantity: 1,
    status: "CANCELLED",
    createdAt: "2026-02-02T16:45:00",
  },
  {
    id: 5,
    userEmail: "user2@example.com",
    productId: 1,
    quantity: 5,
    status: "CONFIRMED",
    createdAt: "2026-02-02T11:20:00",
  },
  {
    id: 6,
    userEmail: "user4@example.com",
    productId: 4,
    quantity: 2,
    status: "OUT_OF_STOCK",
    createdAt: "2026-02-01T15:30:00",
  },
]

const PRODUCT_NAMES: Record<number, string> = {
  1: "프리미엄 무선 이어폰",
  2: "스마트 워치 Pro",
  3: "휴대용 블루투스 스피커",
  4: "무선 충전 패드",
  5: "노이즈 캔슬링 헤드폰",
  6: "미니 프로젝터",
}

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
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [reservations, setReservations] = useState<Reservation[]>(DEMO_ALL_RESERVATIONS)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({ productName: "", totalStock: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const handleCreateProduct = async () => {
    if (!token || !productForm.productName || !productForm.totalStock) return

    setIsSubmitting(true)
    try {
      const newProduct = await createProduct(token, {
        productName: productForm.productName,
        totalStock: parseInt(productForm.totalStock),
      })
      setProducts((prev) => [...prev, newProduct])
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

  const handleUpdateProduct = async () => {
    if (!token || !editingProduct || !productForm.productName || !productForm.totalStock) return

    setIsSubmitting(true)
    try {
      const updated = await updateProduct(token, editingProduct.id, {
        productName: productForm.productName,
        totalStock: parseInt(productForm.totalStock),
      })
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updated : p))
      )
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

  const handleDeleteProduct = async (productId: number) => {
    if (!token) return

    try {
      await deleteProduct(token, productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
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

  // 통계 계산
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0)
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
                                  ? "text-warning font-medium"
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
                    <CardDescription>{filteredReservations.length}개의 예약</CardDescription>
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
                            <TableCell>
                              {PRODUCT_NAMES[reservation.productId] || `상품 #${reservation.productId}`}
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
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  )
}

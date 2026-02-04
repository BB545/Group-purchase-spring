"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { store, type Product } from "@/lib/store"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Package, Search, ShoppingCart, AlertCircle } from "lucide-react"

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    setProducts(store.getProducts())
    const unsubscribe = store.subscribe(() => {
      setProducts(store.getProducts())
    })
    return unsubscribe
  }, [])

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (product: Product) => {
    const percentage = (product.remainStock / product.totalStock) * 100
    if (product.remainStock === 0) return { label: "품절", variant: "destructive" as const }
    if (percentage <= 20) return { label: "마감임박", variant: "secondary" as const }
    return { label: "판매중", variant: "default" as const }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">상품 목록</h1>
            <p className="text-muted-foreground mt-1">공동구매 가능한 상품을 확인하세요</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="상품 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">상품이 없습니다</h2>
            <p className="text-muted-foreground">검색 조건에 맞는 상품을 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product)
              const soldPercentage = ((product.totalStock - product.remainStock) / product.totalStock) * 100

              return (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{product.productName}</CardTitle>
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">총 재고:</span>
                          <span className="font-medium">{product.totalStock}개</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">판매 현황</span>
                          <span className="font-medium">
                            {product.totalStock - product.remainStock} / {product.totalStock}
                          </span>
                        </div>
                        <Progress value={soldPercentage} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">남은 수량</span>
                        <span className={`font-semibold ${product.remainStock === 0 ? "text-destructive" : product.remainStock <= 10 ? "text-orange-500" : "text-foreground"}`}>
                          {product.remainStock}개
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {product.remainStock === 0 ? (
                      <Button className="w-full" variant="secondary" disabled>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        품절
                      </Button>
                    ) : user ? (
                      <Button className="w-full" asChild>
                        <Link href={`/products/${product.id}`}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          예약하기
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/login">로그인 후 예약</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return <ProductsContent />
}

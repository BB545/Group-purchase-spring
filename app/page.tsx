"use client"

import Link from "next/link"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Users, Clock, Shield, ArrowRight, Package, TrendingDown, Star } from "lucide-react"

function HomePage() {
  console.log("[v0] HomePage component rendering")
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-20">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              함께 구매하면 더 저렴하게
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              공동구매로<br />
              <span className="text-primary">스마트한 소비</span>를 시작하세요
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              원하는 상품을 더 저렴하게 구매하세요. 
              여러 사람이 함께 구매하면 할인 혜택을 받을 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/products" className="gap-2">
                  상품 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">왜 공동구매인가요?</h2>
            <p className="text-muted-foreground">공동구매의 다양한 장점을 확인하세요</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">가격 절감</h3>
                <p className="text-sm text-muted-foreground">
                  대량 구매로 개인 구매보다 더 저렴한 가격에 상품을 구입할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">커뮤니티</h3>
                <p className="text-sm text-muted-foreground">
                  같은 관심사를 가진 사람들과 함께 구매하며 정보를 공유할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">간편한 예약</h3>
                <p className="text-sm text-muted-foreground">
                  원하는 상품을 예약하고 결제 대기 상태에서 편리하게 관리할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">안전한 거래</h3>
                <p className="text-sm text-muted-foreground">
                  검증된 시스템으로 안전하게 거래하고 투명한 재고 관리를 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">이용 방법</h2>
            <p className="text-muted-foreground">간단한 3단계로 공동구매에 참여하세요</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">회원가입</h3>
              <p className="text-sm text-muted-foreground">
                간단한 정보 입력으로 회원가입을 완료하세요.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">상품 선택</h3>
              <p className="text-sm text-muted-foreground">
                원하는 상품을 찾아 수량을 선택하고 예약하세요.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">구매 완료</h3>
              <p className="text-sm text-muted-foreground">
                예약이 확정되면 결제를 진행하고 상품을 받으세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <Package className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg opacity-90 mb-8">
            수많은 상품이 공동구매를 기다리고 있습니다. 
            회원가입하고 특별한 가격으로 구매하세요.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products" className="gap-2">
              상품 보러가기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-semibold">공동구매</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 Group Purchase Service. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return <HomePage />
}

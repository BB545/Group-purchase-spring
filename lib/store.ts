// Types
export interface User {
  email: string
  nickname: string
  password: string
  role: "USER" | "ADMIN"
}

export interface Product {
  id: number
  productName: string
  totalStock: number
  remainStock: number
  createdAt: string
  updatedAt: string
}

export interface Reservation {
  id: number
  userEmail: string
  productId: number
  productName: string
  quantity: number
  status: "WAITING" | "CONFIRMED" | "OUT_OF_STOCK" | "CANCELLED"
  createdAt: string
}

// Initial mock data
const initialProducts: Product[] = [
  {
    id: 1,
    productName: "프리미엄 유기농 사과 (10kg)",
    totalStock: 100,
    remainStock: 45,
    createdAt: "2025-01-15T09:00:00",
    updatedAt: "2025-02-01T14:30:00",
  },
  {
    id: 2,
    productName: "제주 감귤 선물세트 (5kg)",
    totalStock: 200,
    remainStock: 12,
    createdAt: "2025-01-20T10:00:00",
    updatedAt: "2025-02-02T11:00:00",
  },
  {
    id: 3,
    productName: "한우 등심 세트 (1kg)",
    totalStock: 50,
    remainStock: 0,
    createdAt: "2025-01-25T08:00:00",
    updatedAt: "2025-02-03T16:45:00",
  },
  {
    id: 4,
    productName: "홈메이드 김치 (10kg)",
    totalStock: 150,
    remainStock: 89,
    createdAt: "2025-01-28T12:00:00",
    updatedAt: "2025-02-01T09:20:00",
  },
  {
    id: 5,
    productName: "유기농 현미 (20kg)",
    totalStock: 80,
    remainStock: 65,
    createdAt: "2025-02-01T07:00:00",
    updatedAt: "2025-02-04T10:15:00",
  },
  {
    id: 6,
    productName: "프리미엄 들기름 (500ml x 2)",
    totalStock: 120,
    remainStock: 3,
    createdAt: "2025-02-02T11:30:00",
    updatedAt: "2025-02-04T15:00:00",
  },
]

const initialUsers: User[] = [
  {
    email: "admin@example.com",
    nickname: "관리자",
    password: "admin123",
    role: "ADMIN",
  },
  {
    email: "user@example.com",
    nickname: "테스트유저",
    password: "user123",
    role: "USER",
  },
]

const initialReservations: Reservation[] = [
  {
    id: 1,
    userEmail: "user@example.com",
    productId: 1,
    productName: "프리미엄 유기농 사과 (10kg)",
    quantity: 2,
    status: "CONFIRMED",
    createdAt: "2025-02-01T10:30:00",
  },
  {
    id: 2,
    userEmail: "user@example.com",
    productId: 2,
    productName: "제주 감귤 선물세트 (5kg)",
    quantity: 1,
    status: "WAITING",
    createdAt: "2025-02-03T14:20:00",
  },
]

// Store class with state management
class Store {
  private products: Product[] = [...initialProducts]
  private users: User[] = [...initialUsers]
  private reservations: Reservation[] = [...initialReservations]
  private nextProductId = 7
  private nextReservationId = 3
  private listeners: Set<() => void> = new Set()

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  // User methods
  getUsers() {
    return [...this.users]
  }

  findUser(email: string) {
    return this.users.find((u) => u.email === email)
  }

  registerUser(email: string, password: string, nickname: string): User {
    if (this.users.some((u) => u.email === email)) {
      throw new Error("이미 등록된 이메일입니다.")
    }
    const newUser: User = { email, password, nickname, role: "USER" }
    this.users.push(newUser)
    this.notify()
    return newUser
  }

  loginUser(email: string, password: string): User {
    const user = this.users.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
    }
    return user
  }

  // Product methods
  getProducts() {
    return [...this.products]
  }

  getProduct(id: number) {
    const product = this.products.find((p) => p.id === id)
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.")
    }
    return { ...product }
  }

  createProduct(productName: string, totalStock: number): Product {
    const now = new Date().toISOString()
    const newProduct: Product = {
      id: this.nextProductId++,
      productName,
      totalStock,
      remainStock: totalStock,
      createdAt: now,
      updatedAt: now,
    }
    this.products.push(newProduct)
    this.notify()
    return newProduct
  }

  updateProduct(id: number, productName: string, totalStock: number): Product {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("상품을 찾을 수 없습니다.")
    }
    const current = this.products[index]
    const stockDiff = totalStock - current.totalStock
    const newRemainStock = Math.max(0, current.remainStock + stockDiff)
    
    this.products[index] = {
      ...current,
      productName,
      totalStock,
      remainStock: newRemainStock,
      updatedAt: new Date().toISOString(),
    }
    this.notify()
    return { ...this.products[index] }
  }

  deleteProduct(id: number): void {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("상품을 찾을 수 없습니다.")
    }
    this.products.splice(index, 1)
    this.notify()
  }

  // Reservation methods
  getReservations() {
    return [...this.reservations]
  }

  getMyReservations(userEmail: string) {
    return this.reservations.filter((r) => r.userEmail === userEmail)
  }

  getAllReservations(status?: string) {
    if (status) {
      return this.reservations.filter((r) => r.status === status)
    }
    return [...this.reservations]
  }

  createReservation(userEmail: string, productId: number, quantity: number): Reservation {
    const product = this.getProduct(productId)
    
    if (product.remainStock < quantity) {
      throw new Error("재고가 부족합니다.")
    }

    // Update product stock
    const productIndex = this.products.findIndex((p) => p.id === productId)
    this.products[productIndex] = {
      ...this.products[productIndex],
      remainStock: this.products[productIndex].remainStock - quantity,
      updatedAt: new Date().toISOString(),
    }

    const newReservation: Reservation = {
      id: this.nextReservationId++,
      userEmail,
      productId,
      productName: product.productName,
      quantity,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    }
    this.reservations.push(newReservation)
    this.notify()
    return newReservation
  }

  cancelReservation(reservationId: number, userEmail: string): void {
    const index = this.reservations.findIndex((r) => r.id === reservationId)
    if (index === -1) {
      throw new Error("예약을 찾을 수 없습니다.")
    }
    
    const reservation = this.reservations[index]
    if (reservation.userEmail !== userEmail) {
      throw new Error("본인의 예약만 취소할 수 있습니다.")
    }
    
    if (reservation.status !== "WAITING") {
      throw new Error("대기 중인 예약만 취소할 수 있습니다.")
    }

    // Return stock
    const productIndex = this.products.findIndex((p) => p.id === reservation.productId)
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        remainStock: this.products[productIndex].remainStock + reservation.quantity,
        updatedAt: new Date().toISOString(),
      }
    }

    this.reservations[index] = {
      ...reservation,
      status: "CANCELLED",
    }
    this.notify()
  }

  confirmReservation(reservationId: number): void {
    const index = this.reservations.findIndex((r) => r.id === reservationId)
    if (index === -1) {
      throw new Error("예약을 찾을 수 없습니다.")
    }
    
    if (this.reservations[index].status !== "WAITING") {
      throw new Error("대기 중인 예약만 확정할 수 있습니다.")
    }

    this.reservations[index] = {
      ...this.reservations[index],
      status: "CONFIRMED",
    }
    this.notify()
  }
}

// Singleton instance
export const store = new Store()

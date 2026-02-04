// API Base URL - 백엔드 서버 주소로 변경 필요
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Types
export interface User {
  email: string
  nickname: string
  role: string
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
  quantity: number
  status: "WAITING" | "CONFIRMED" | "OUT_OF_STOCK" | "CANCELLED"
  createdAt: string
}

// Auth API
export async function registerUser(data: { email: string; password: string; nickname: string }) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("회원가입에 실패했습니다.")
  }
  return response.text()
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("로그인에 실패했습니다.")
  }
  return response.text()
}

// Inventory API
export async function getProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`)
  if (!response.ok) {
    throw new Error("상품을 찾을 수 없습니다.")
  }
  return response.json() as Promise<Product>
}

export async function createProduct(token: string, data: { productName: string; totalStock: number }) {
  const response = await fetch(`${API_BASE_URL}/inventory/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("상품 생성에 실패했습니다.")
  }
  return response.json() as Promise<Product>
}

export async function updateProduct(token: string, id: number, data: { productName: string; totalStock: number }) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("상품 수정에 실패했습니다.")
  }
  return response.json() as Promise<Product>
}

export async function deleteProduct(token: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error("상품 삭제에 실패했습니다.")
  }
  return response.text()
}

// Reservation API
export async function createReservation(token: string, productId: number, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/reservations/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "예약에 실패했습니다.")
  }
  return response.text()
}

export async function getMyReservations(token: string) {
  const response = await fetch(`${API_BASE_URL}/reservations/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error("예약 목록을 가져올 수 없습니다.")
  }
  return response.json() as Promise<Reservation[]>
}

export async function getAllReservations(token: string, status?: string) {
  const url = status
    ? `${API_BASE_URL}/reservations/admin/all?status=${status}`
    : `${API_BASE_URL}/reservations/admin/all`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error("예약 목록을 가져올 수 없습니다.")
  }
  return response.json() as Promise<Reservation[]>
}

export async function cancelReservation(token: string, reservationId: number) {
  const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "예약 취소에 실패했습니다.")
  }
  return response.text()
}

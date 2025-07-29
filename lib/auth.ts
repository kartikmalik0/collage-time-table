import type { User } from "./types"
import { getUsers, addUser } from "./data"

export function authenticateUser(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }
  return null
}

export function registerUser(userData: Omit<User, "id">): boolean {
  const users = getUsers()
  const existingUser = users.find((u) => u.email === userData.email)
  if (existingUser) {
    return false
  }

  return addUser(userData)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

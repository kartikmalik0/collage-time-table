"use client"

import { useEffect, useState } from "react"
import LoginForm from "@/components/auth/login-form"
import StudentDashboard from "@/components/dashboards/student-dashboard"
import TeacherDashboard from "@/components/dashboards/teacher-dashboard"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "student" && <StudentDashboard user={user} onLogout={handleLogout} />}
      {user.role === "teacher" && <TeacherDashboard user={user} onLogout={handleLogout} />}
      {user.role === "admin" && <AdminDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}

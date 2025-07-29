"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, Class, Teacher } from "@/lib/types"
import { getClasses, getUsers, getTeachers } from "@/lib/data"
import { LogOut, Users, BookOpen, GraduationCap, Clock } from "lucide-react"
import UserManagement from "@/components/management/user-management"
import TeacherManagement from "@/components/management/teacher-management"
import ClassManagement from "@/components/management/class-management"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setClasses(getClasses())
    setUsers(getUsers())
    setTeachers(getTeachers())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleDataUpdate = () => {
    setClasses(getClasses())
    setUsers(getUsers())
    setTeachers(getTeachers())
  }

  const stats = {
    totalUsers: users.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    activeClasses: classes.filter((cls) => {
      const now = new Date()
      const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
      const currentTimeStr = now.toTimeString().slice(0, 5)
      return cls.day === currentDay && cls.startTime <= currentTimeStr && cls.endTime >= currentTimeStr
    }).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">{currentTime.toLocaleTimeString()}</div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Faculty members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Scheduled classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClasses}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
            <TabsTrigger value="classes">Class Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement onUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="teachers">
            <TeacherManagement onUpdate={handleDataUpdate} />
          </TabsContent>

          <TabsContent value="classes">
            <ClassManagement teacherId={user.id} onUpdate={handleDataUpdate} canManageAll={true} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

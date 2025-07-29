"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, Class } from "@/lib/types"
import { getClasses } from "@/lib/data"
import { LogOut, Clock, BookOpen } from "lucide-react"
import ClassManagement from "@/components/management/class-management"

interface TeacherDashboardProps {
  user: User
  onLogout: () => void
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setClasses(getClasses())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const myClasses = classes.filter((cls) => cls.teacherId === user.id)

  const getCurrentClass = () => {
    const now = new Date()
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
    const currentTimeStr = now.toTimeString().slice(0, 5)

    return myClasses.find(
      (cls) => cls.day === currentDay && cls.startTime <= currentTimeStr && cls.endTime >= currentTimeStr,
    )
  }

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    return myClasses.filter((cls) => cls.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getWeekClasses = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days.map((day) => ({
      day,
      classes: myClasses.filter((cls) => cls.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }))
  }

  const currentClass = getCurrentClass()
  const todayClasses = getTodayClasses()
  const weekClasses = getWeekClasses()

  const handleClassUpdate = () => {
    setClasses(getClasses())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
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
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="manage">Manage Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Class */}
              <div className="lg:col-span-1">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Current Class
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentClass ? (
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{currentClass.subject}</h3>
                          <p className="text-gray-600">{currentClass.room}</p>
                          <p className="text-gray-600">{currentClass.department}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {currentClass.startTime} - {currentClass.endTime}
                        </div>
                        <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                      </div>
                    ) : (
                      <p className="text-gray-600">No class currently in session</p>
                    )}
                  </CardContent>
                </Card>

                {/* Today's Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Classes</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayClasses.length > 0 ? (
                        todayClasses.map((cls) => (
                          <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{cls.subject}</h4>
                              <p className="text-sm text-gray-600">{cls.room}</p>
                              <p className="text-sm text-gray-600">{cls.department}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{cls.startTime}</p>
                              <p className="text-sm text-gray-600">{cls.endTime}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No classes today</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Schedule */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Weekly Schedule
                    </CardTitle>
                    <CardDescription>Your teaching schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {weekClasses.map(({ day, classes: dayClasses }) => (
                        <div key={day}>
                          <h3 className="font-semibold text-lg mb-3 text-gray-900">{day}</h3>
                          <div className="grid gap-3">
                            {dayClasses.length > 0 ? (
                              dayClasses.map((cls) => (
                                <div
                                  key={cls.id}
                                  className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
                                >
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{cls.subject}</h4>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-gray-600">{cls.room}</span>
                                      <span className="text-sm text-gray-600">{cls.department}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                      {cls.startTime} - {cls.endTime}
                                    </p>
                                    <Badge variant="outline" className="mt-1">
                                      {cls.type}
                                    </Badge>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 italic">No classes scheduled</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <ClassManagement teacherId={user.id} onUpdate={handleClassUpdate} canManageAll={user.role === "admin"} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

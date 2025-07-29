"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Class, Teacher } from "@/lib/types"
import { getClasses, addClass, updateClass, deleteClass, getTeachers } from "@/lib/data"
import { Plus, Edit, Trash2, Search, Clock } from "lucide-react"

interface ClassManagementProps {
  teacherId: string
  onUpdate: () => void
  canManageAll: boolean
}

export default function ClassManagement({ teacherId, onUpdate, canManageAll }: ClassManagementProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    teacherId: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
    department: "",
    type: "lecture" as "lecture" | "lab" | "tutorial",
  })

  useEffect(() => {
    setClasses(getClasses())
    setTeachers(getTeachers())
  }, [])

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.department.toLowerCase().includes(searchTerm.toLowerCase())

    if (canManageAll) return matchesSearch
    return matchesSearch && cls.teacherId === teacherId
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClass) {
      updateClass(editingClass.id, formData)
      setEditingClass(null)
    } else {
      addClass({
        ...formData,
        teacherId: canManageAll ? formData.teacherId : teacherId,
      })
      setIsAddDialogOpen(false)
    }
    setFormData({
      subject: "",
      teacherId: "",
      room: "",
      day: "",
      startTime: "",
      endTime: "",
      department: "",
      type: "lecture",
    })
    setClasses(getClasses())
    onUpdate()
  }

  const handleEdit = (cls: Class) => {
    setEditingClass(cls)
    setFormData({
      subject: cls.subject,
      teacherId: cls.teacherId,
      room: cls.room,
      day: cls.day,
      startTime: cls.startTime,
      endTime: cls.endTime,
      department: cls.department,
      type: cls.type,
    })
  }

  const handleDelete = (classId: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      deleteClass(classId)
      setClasses(getClasses())
      onUpdate()
    }
  }

  const resetForm = () => {
    setFormData({
      subject: "",
      teacherId: "",
      room: "",
      day: "",
      startTime: "",
      endTime: "",
      department: "",
      type: "lecture",
    })
    setEditingClass(null)
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? teacher.name : "Unknown"
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              {canManageAll ? "Manage all classes and schedules" : "Manage your teaching schedule"}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>Create a new class schedule</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  {canManageAll && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teacher" className="text-right">
                        Teacher
                      </Label>
                      <Select
                        value={formData.teacherId}
                        onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                      Room
                    </Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Day
                    </Label>
                    <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "lecture" | "lab" | "tutorial") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Class</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.subject}</TableCell>
                <TableCell>{getTeacherName(cls.teacherId)}</TableCell>
                <TableCell>{cls.room}</TableCell>
                <TableCell>{cls.day}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {cls.startTime} - {cls.endTime}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cls.department}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={cls.type === "lecture" ? "default" : cls.type === "lab" ? "secondary" : "outline"}>
                    {cls.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cls)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(cls.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>Update class information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="edit-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                {canManageAll && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-teacher" className="text-right">
                      Teacher
                    </Label>
                    <Select
                      value={formData.teacherId}
                      onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-room" className="text-right">
                    Room
                  </Label>
                  <Input
                    id="edit-room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-day" className="text-right">
                    Day
                  </Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startTime" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endTime" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="edit-endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "lecture" | "lab" | "tutorial") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Update Class</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

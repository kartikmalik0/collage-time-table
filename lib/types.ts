export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
  studentId: string
  department: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  department: string
  specialization: string
  phone: string
}

export interface Class {
  id: string
  subject: string
  teacherId: string
  room: string
  day: string
  startTime: string
  endTime: string
  department: string
  type: "lecture" | "lab" | "tutorial"
}

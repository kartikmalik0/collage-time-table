import type { User, Teacher, Class } from "./types"

// Initialize default data
const initializeData = () => {
  if (typeof window === "undefined") return

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@college.edu",
        password: "admin123",
        role: "admin",
        studentId: "ADM001",
        department: "Administration",
      },
      {
        id: "2",
        name: "Dr. John Smith",
        email: "john.smith@college.edu",
        password: "teacher123",
        role: "teacher",
        studentId: "TCH001",
        department: "Computer Science",
      },
      {
        id: "3",
        name: "Alice Johnson",
        email: "alice@student.edu",
        password: "student123",
        role: "student",
        studentId: "CS2021001",
        department: "Computer Science",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  // Initialize teachers if not exists
  if (!localStorage.getItem("teachers")) {
    const defaultTeachers: Teacher[] = [
      {
        id: "2",
        name: "Dr. John Smith",
        email: "john.smith@college.edu",
        department: "Computer Science",
        specialization: "Data Structures & Algorithms",
        phone: "+1-555-0101",
      },
      {
        id: "4",
        name: "Prof. Sarah Wilson",
        email: "sarah.wilson@college.edu",
        department: "Computer Science",
        specialization: "Database Systems",
        phone: "+1-555-0102",
      },
      {
        id: "5",
        name: "Dr. Michael Brown",
        email: "michael.brown@college.edu",
        department: "Mathematics",
        specialization: "Calculus & Linear Algebra",
        phone: "+1-555-0103",
      },
    ]
    localStorage.setItem("teachers", JSON.stringify(defaultTeachers))
  }

  // Initialize classes if not exists
  if (!localStorage.getItem("classes")) {
    const defaultClasses: Class[] = [
      {
        id: "1",
        subject: "Data Structures",
        teacherId: "2",
        room: "CS-101",
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        department: "Computer Science",
        type: "lecture",
      },
      {
        id: "2",
        subject: "Database Systems",
        teacherId: "4",
        room: "CS-102",
        day: "Monday",
        startTime: "11:00",
        endTime: "12:30",
        department: "Computer Science",
        type: "lecture",
      },
      {
        id: "3",
        subject: "Calculus I",
        teacherId: "5",
        room: "MATH-201",
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:30",
        department: "Computer Science",
        type: "lecture",
      },
      {
        id: "4",
        subject: "Data Structures Lab",
        teacherId: "2",
        room: "CS-LAB1",
        day: "Wednesday",
        startTime: "14:00",
        endTime: "16:00",
        department: "Computer Science",
        type: "lab",
      },
      {
        id: "5",
        subject: "Database Systems",
        teacherId: "4",
        room: "CS-102",
        day: "Thursday",
        startTime: "10:00",
        endTime: "11:30",
        department: "Computer Science",
        type: "lecture",
      },
      {
        id: "6",
        subject: "Algorithms",
        teacherId: "2",
        room: "CS-103",
        day: "Friday",
        startTime: "09:00",
        endTime: "10:30",
        department: "Computer Science",
        type: "lecture",
      },
    ]
    localStorage.setItem("classes", JSON.stringify(defaultClasses))
  }
}

// Initialize data on module load
if (typeof window !== "undefined") {
  initializeData()
}

// User management functions
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export function addUser(userData: Omit<User, "id">): boolean {
  const users = getUsers()
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  }
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  return true
}

export function updateUser(id: string, userData: Partial<Omit<User, "id">>): boolean {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...userData }
    localStorage.setItem("users", JSON.stringify(users))
    return true
  }
  return false
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== id)
  localStorage.setItem("users", JSON.stringify(filteredUsers))
  return true
}

// Teacher management functions
export function getTeachers(): Teacher[] {
  if (typeof window === "undefined") return []
  const teachers = localStorage.getItem("teachers")
  return teachers ? JSON.parse(teachers) : []
}

export function addTeacher(teacherData: Omit<Teacher, "id">): boolean {
  const teachers = getTeachers()
  const newTeacher: Teacher = {
    ...teacherData,
    id: Date.now().toString(),
  }
  teachers.push(newTeacher)
  localStorage.setItem("teachers", JSON.stringify(teachers))
  return true
}

export function updateTeacher(id: string, teacherData: Partial<Omit<Teacher, "id">>): boolean {
  const teachers = getTeachers()
  const index = teachers.findIndex((t) => t.id === id)
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...teacherData }
    localStorage.setItem("teachers", JSON.stringify(teachers))
    return true
  }
  return false
}

export function deleteTeacher(id: string): boolean {
  const teachers = getTeachers()
  const filteredTeachers = teachers.filter((t) => t.id !== id)
  localStorage.setItem("teachers", JSON.stringify(filteredTeachers))
  return true
}

// Class management functions
export function getClasses(): Class[] {
  if (typeof window === "undefined") return []
  const classes = localStorage.getItem("classes")
  return classes ? JSON.parse(classes) : []
}

export function addClass(classData: Omit<Class, "id">): boolean {
  const classes = getClasses()
  const newClass: Class = {
    ...classData,
    id: Date.now().toString(),
  }
  classes.push(newClass)
  localStorage.setItem("classes", JSON.stringify(classes))
  return true
}

export function updateClass(id: string, classData: Partial<Omit<Class, "id">>): boolean {
  const classes = getClasses()
  const index = classes.findIndex((c) => c.id === id)
  if (index !== -1) {
    classes[index] = { ...classes[index], ...classData }
    localStorage.setItem("classes", JSON.stringify(classes))
    return true
  }
  return false
}

export function deleteClass(id: string): boolean {
  const classes = getClasses()
  const filteredClasses = classes.filter((c) => c.id !== id)
  localStorage.setItem("classes", JSON.stringify(filteredClasses))
  return true
}

import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string // In production, this should be hashed
  name: string
  role: "member" | "trainer" | "admin"
  currentWeight?: number
  targetWeight?: number
  streak?: number
  createdAt: Date
  updatedAt: Date
}

export interface UserPackage {
  _id?: ObjectId
  userId: ObjectId
  packageId: string
  packageName: string
  packageType: "session" | "duration"
  totalSessions?: number
  usedSessions: number
  startDate: Date
  endDate?: Date
  status: "active" | "expired" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  _id?: ObjectId
  userId: ObjectId
  checkInTime: Date
  checkOutTime?: Date
  duration?: number // in minutes
  workoutType?: string
  notes?: string
  createdAt: Date
}

export interface WorkoutProgress {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  weight?: number
  exercises: {
    name: string
    sets: number
    reps: number
    weight: number
  }[]
  notes?: string
  createdAt: Date
}

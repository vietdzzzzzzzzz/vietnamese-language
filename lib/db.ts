import clientPromise from "./mongodb"
import type { User, UserPackage, Attendance, WorkoutProgress } from "./models/User"
import { ObjectId } from "mongodb"

const DB_NAME = "gymora"

// Database helper functions
export async function getDatabase() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// User operations
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()
  
  const user: Omit<User, "_id"> = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }
  
  const result = await db.collection<User>("users").insertOne(user as User)
  return result.insertedId
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ email })
}

export async function getUserById(userId: string | ObjectId) {
  const db = await getDatabase()
  const _id = typeof userId === "string" ? new ObjectId(userId) : userId
  return db.collection<User>("users").findOne({ _id })
}

export async function updateUser(userId: string | ObjectId, updates: Partial<User>) {
  const db = await getDatabase()
  const _id = typeof userId === "string" ? new ObjectId(userId) : userId
  
  const result = await db.collection<User>("users").updateOne(
    { _id },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    }
  )
  
  return result.modifiedCount > 0
}

// User Package operations
export async function createUserPackage(packageData: Omit<UserPackage, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()
  
  const userPackage: Omit<UserPackage, "_id"> = {
    ...packageData,
    createdAt: now,
    updatedAt: now,
  }
  
  const result = await db.collection<UserPackage>("user_packages").insertOne(userPackage as UserPackage)
  return result.insertedId
}

export async function getUserPackages(userId: string | ObjectId) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  return db.collection<UserPackage>("user_packages")
    .find({ userId: _userId })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getActiveUserPackage(userId: string | ObjectId) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  return db.collection<UserPackage>("user_packages").findOne({
    userId: _userId,
    status: "active",
  })
}

// Attendance operations
export async function createAttendance(attendanceData: Omit<Attendance, "_id" | "createdAt">) {
  const db = await getDatabase()
  
  const attendance: Omit<Attendance, "_id"> = {
    ...attendanceData,
    createdAt: new Date(),
  }
  
  const result = await db.collection<Attendance>("attendance").insertOne(attendance as Attendance)
  return result.insertedId
}

export async function getUserAttendance(userId: string | ObjectId, limit = 30) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  return db.collection<Attendance>("attendance")
    .find({ userId: _userId })
    .sort({ checkInTime: -1 })
    .limit(limit)
    .toArray()
}

export async function updateAttendanceCheckout(attendanceId: string | ObjectId, checkOutTime: Date) {
  const db = await getDatabase()
  const _id = typeof attendanceId === "string" ? new ObjectId(attendanceId) : attendanceId
  
  const attendance = await db.collection<Attendance>("attendance").findOne({ _id })
  if (!attendance) return false
  
  const duration = Math.floor((checkOutTime.getTime() - attendance.checkInTime.getTime()) / 60000)
  
  const result = await db.collection<Attendance>("attendance").updateOne(
    { _id },
    { 
      $set: { 
        checkOutTime, 
        duration 
      } 
    }
  )
  
  return result.modifiedCount > 0
}

// Workout Progress operations
export async function createWorkoutProgress(progressData: Omit<WorkoutProgress, "_id" | "createdAt">) {
  const db = await getDatabase()
  
  const progress: Omit<WorkoutProgress, "_id"> = {
    ...progressData,
    createdAt: new Date(),
  }
  
  const result = await db.collection<WorkoutProgress>("workout_progress").insertOne(progress as WorkoutProgress)
  return result.insertedId
}

export async function getUserWorkoutProgress(userId: string | ObjectId, limit = 30) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  return db.collection<WorkoutProgress>("workout_progress")
    .find({ userId: _userId })
    .sort({ date: -1 })
    .limit(limit)
    .toArray()
}

export async function getWorkoutProgressByDateRange(
  userId: string | ObjectId,
  startDate: Date,
  endDate: Date
) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  return db.collection<WorkoutProgress>("workout_progress")
    .find({
      userId: _userId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: 1 })
    .toArray()
}

// Statistics and analytics
export async function getUserStats(userId: string | ObjectId) {
  const db = await getDatabase()
  const _userId = typeof userId === "string" ? new ObjectId(userId) : userId
  
  const user = await getUserById(_userId)
  const attendance = await getUserAttendance(_userId, 30)
  const workoutProgress = await getUserWorkoutProgress(_userId, 10)
  const activePackage = await getActiveUserPackage(_userId)
  
  // Calculate attendance rate for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentAttendance = attendance.filter(
    (a) => a.checkInTime >= thirtyDaysAgo
  )
  
  const attendanceRate = Math.round((recentAttendance.length / 30) * 100)
  
  // Get weight progress
  const latestProgress = workoutProgress[0]
  const oldestProgress = workoutProgress[workoutProgress.length - 1]
  
  return {
    user,
    activePackage,
    stats: {
      totalAttendance: attendance.length,
      recentAttendance: recentAttendance.length,
      attendanceRate,
      currentWeight: user?.currentWeight || latestProgress?.weight,
      targetWeight: user?.targetWeight,
      weightChange: latestProgress && oldestProgress 
        ? (oldestProgress.weight || 0) - (latestProgress.weight || 0)
        : 0,
      streak: user?.streak || 0,
      totalWorkouts: workoutProgress.length,
    },
    recentWorkouts: workoutProgress.slice(0, 5),
  }
}

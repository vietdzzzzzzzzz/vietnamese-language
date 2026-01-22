import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import type { User, UserPackage, Attendance, WorkoutProgress } from "@/lib/models/User"

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }
    if (sessionUser.role !== "trainer" && sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "User ID required." }, { status: 400 })
    }

    const db = await getDatabase()
    const _id = new ObjectId(userId)

    const user = await db.collection<User>("users").findOne({ _id })
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    const activePackage = await db
      .collection<UserPackage>("packages")
      .findOne({ userId: _id, status: "active" })

    const attendance = await db
      .collection<Attendance>("attendances")
      .find({ userId: _id })
      .sort({ checkInTime: -1 })
      .toArray()

    const progress = await db
      .collection<WorkoutProgress>("progress")
      .find({ userId: _id })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      user: {
        id: user._id?.toString() ?? "",
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        height: user.height,
        currentWeight: user.currentWeight || 0,
        targetWeight: user.targetWeight || 0,
        streak: user.streak || 0,
        createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
      },
      package: activePackage
        ? {
            name: activePackage.packageName,
            type: activePackage.packageType,
            totalSessions: activePackage.totalSessions,
            usedSessions: activePackage.usedSessions,
            startDate: activePackage.startDate?.toISOString?.() || new Date().toISOString(),
            endDate: activePackage.endDate?.toISOString?.(),
            status: activePackage.status,
          }
        : null,
      attendance: attendance.map((record) => ({
        id: record._id?.toString() ?? "",
        checkInTime: record.checkInTime?.toISOString?.() || new Date().toISOString(),
        checkOutTime: record.checkOutTime?.toISOString?.(),
        duration: record.duration,
        workoutType: record.workoutType,
        notes: record.notes,
      })),
      progress: progress.map((record) => ({
        id: record._id?.toString() ?? "",
        date: record.date?.toISOString?.() || new Date().toISOString(),
        weight: record.weight,
        exercisesCount: record.exercises?.length || 0,
        notes: record.notes,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load member details." }, { status: 500 })
  }
}

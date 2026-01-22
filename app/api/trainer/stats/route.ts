import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export async function GET() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }
    if (sessionUser.role !== "trainer" && sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const db = await getDatabase()
    const trainerId = new ObjectId(sessionUser.id)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalMembers, newMembersLast30, workoutsCreated, workoutsLast7, unreadMessages] = await Promise.all([
      db.collection("users").countDocuments({ role: "member" }),
      db.collection("users").countDocuments({ role: "member", createdAt: { $gte: thirtyDaysAgo } }),
      db.collection("trainer_workouts").countDocuments({ trainerId }),
      db.collection("trainer_workouts").countDocuments({ trainerId, createdAt: { $gte: sevenDaysAgo } }),
      db.collection("chat_messages").countDocuments({ toId: trainerId, read: false }),
    ])
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const [todaySessions, todayCompleted] = await Promise.all([
      db.collection("attendances").countDocuments({
        checkInTime: { $gte: startOfDay, $lte: endOfDay },
      }),
      db.collection("attendances").countDocuments({
        checkInTime: { $gte: startOfDay, $lte: endOfDay },
        checkOutTime: { $ne: null },
      }),
    ])

    return NextResponse.json({
      totalMembers,
      newMembersLast30,
      workoutsCreated,
      workoutsLast7,
      todaySessions,
      todayCompleted,
      unreadMessages,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load trainer stats." }, { status: 500 })
  }
}

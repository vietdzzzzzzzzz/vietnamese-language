import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import type { User } from "@/lib/models/User"

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
    const members = await db
      .collection<User>("users")
      .find({ role: "member" })
      .project({
        email: 1,
        name: 1,
        avatar: 1,
        currentWeight: 1,
        targetWeight: 1,
        height: 1,
        streak: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 })
      .toArray()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const totalAttendance = await db.collection("attendances").countDocuments({
          userId: member._id,
          checkInTime: { $gte: thirtyDaysAgo },
        })
        const totalWorkouts = await db.collection("progress").countDocuments({ userId: member._id })

        return {
          id: member._id?.toString() ?? "",
          email: member.email,
          name: member.name,
          avatar: member.avatar,
          currentWeight: member.currentWeight || 0,
          targetWeight: member.targetWeight || 0,
          height: member.height || 0,
          streak: member.streak || 0,
          totalAttendance,
          totalWorkouts,
          createdAt: member.createdAt?.toISOString?.() || new Date().toISOString(),
        }
      }),
    )

    return NextResponse.json({
      members: membersWithStats,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load members." }, { status: 500 })
  }
}

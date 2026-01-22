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

    const db = await getDatabase()
    const trainers = await db
      .collection<User>("users")
      .find({ role: "trainer" })
      .project({ name: 1, email: 1, avatar: 1 })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      trainers: trainers.map((trainer) => ({
        id: trainer._id?.toString() ?? "",
        name: trainer.name,
        email: trainer.email,
        avatar: trainer.avatar,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load trainers." }, { status: 500 })
  }
}

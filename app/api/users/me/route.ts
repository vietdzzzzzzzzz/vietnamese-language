import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(sessionUser.id) })
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id?.toString() ?? "",
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        currentWeight: user.currentWeight || 0,
        targetWeight: user.targetWeight || 0,
        height: user.height || 0,
        streak: user.streak || 0,
        createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await request.json()
    const { currentWeight, targetWeight, height, avatar } = body || {}

    const updates: Partial<User> = {}
    if (typeof currentWeight === "number") updates.currentWeight = currentWeight
    if (typeof targetWeight === "number") updates.targetWeight = targetWeight
    if (typeof height === "number") updates.height = height
    if (typeof avatar === "string") updates.avatar = avatar

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided." }, { status: 400 })
    }

    const db = await getDatabase()
    await db.collection<User>("users").updateOne(
      { _id: new ObjectId(sessionUser.id) },
      { $set: { ...updates, updatedAt: new Date() } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 })
  }
}

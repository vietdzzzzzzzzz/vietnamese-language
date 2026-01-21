import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (email) {
      const user = await db.collection<User>("users").findOne({ email })
      return NextResponse.json({ user })
    }

    const users = await db.collection<User>("users").find({}).toArray()
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { email, password, name, role } = body

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser: User = {
      email,
      password, // In production, hash this with bcrypt
      name,
      role: role || "member",
      currentWeight: 0,
      targetWeight: 0,
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser)
    return NextResponse.json({ userId: result.insertedId, user: newUser })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { email, updates } = body

    const result = await db
      .collection<User>("users")
      .updateOne({ email }, { $set: { ...updates, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

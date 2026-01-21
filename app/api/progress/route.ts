import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { WorkoutProgress } from "@/lib/models/User"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const progress = await db
      .collection<WorkoutProgress>("progress")
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({ progress })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { userId, date, weight, exercises, notes } = body

    const newProgress: WorkoutProgress = {
      userId: new ObjectId(userId),
      date: new Date(date),
      weight,
      exercises,
      notes,
      createdAt: new Date(),
    }

    const result = await db.collection<WorkoutProgress>("progress").insertOne(newProgress)
    return NextResponse.json({ progressId: result.insertedId, progress: newProgress })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create progress" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Attendance } from "@/lib/models/User"
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

    const attendances = await db
      .collection<Attendance>("attendances")
      .find({ userId: new ObjectId(userId) })
      .sort({ checkInTime: -1 })
      .toArray()

    return NextResponse.json({ attendances })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { userId, checkInTime, checkOutTime, duration, workoutType, notes } = body

    const newAttendance: Attendance = {
      userId: new ObjectId(userId),
      checkInTime: new Date(checkInTime),
      checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
      duration,
      workoutType,
      notes,
      createdAt: new Date(),
    }

    const result = await db.collection<Attendance>("attendances").insertOne(newAttendance)

    // Update user streak and package used sessions
    // Calculate streak logic here

    return NextResponse.json({ attendanceId: result.insertedId, attendance: newAttendance })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 })
  }
}

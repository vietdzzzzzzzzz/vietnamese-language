import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Attendance, UserPackage } from "@/lib/models/User"
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

    return NextResponse.json({
      attendances: attendances.map((record) => ({
        id: record._id?.toString() ?? "",
        checkInTime: record.checkInTime?.toISOString?.() || new Date().toISOString(),
        checkOutTime: record.checkOutTime?.toISOString?.(),
        duration: record.duration,
        workoutType: record.workoutType,
        notes: record.notes,
      })),
    })
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

    const activePackage = await db
      .collection<UserPackage>("packages")
      .findOne({ userId: new ObjectId(userId), status: "active" })
    if (activePackage?.packageType === "session") {
      await db.collection<UserPackage>("packages").updateOne(
        { _id: activePackage._id },
        { $inc: { usedSessions: 1 }, $set: { updatedAt: new Date() } },
      )
    }

    return NextResponse.json({ attendanceId: result.insertedId, attendance: newAttendance })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { attendanceId, checkOutTime } = body

    if (!attendanceId || !checkOutTime) {
      return NextResponse.json({ error: "Attendance ID and checkOutTime required" }, { status: 400 })
    }

    const _id = new ObjectId(attendanceId)
    const attendance = await db.collection<Attendance>("attendances").findOne({ _id })
    if (!attendance) {
      return NextResponse.json({ error: "Attendance not found" }, { status: 404 })
    }

    const checkOutDate = new Date(checkOutTime)
    const duration = Math.floor((checkOutDate.getTime() - attendance.checkInTime.getTime()) / 60000)

    await db.collection<Attendance>("attendances").updateOne(
      { _id },
      { $set: { checkOutTime: checkOutDate, duration } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

type AssignedExercise = {
  name: string
  sets: number
  reps: number | string
  restTime: number
  videoUrl?: string
  notes?: string
}

type AssignedWorkout = {
  _id?: ObjectId
  trainerId: ObjectId
  userId: ObjectId
  name: string
  date: Date
  exercises: AssignedExercise[]
  createdAt: Date
}

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get("userId")

    let userIdToQuery: ObjectId
    if (sessionUser.role === "member") {
      userIdToQuery = new ObjectId(sessionUser.id)
    } else {
      if (!requestedUserId) {
        return NextResponse.json({ error: "userId required." }, { status: 400 })
      }
      userIdToQuery = new ObjectId(requestedUserId)
    }

    const db = await getDatabase()
    const workouts = await db
      .collection<AssignedWorkout>("assigned_workouts")
      .find({ userId: userIdToQuery })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      workouts: workouts.map((item) => ({
        id: item._id?.toString() ?? "",
        name: item.name,
        date: item.date.toISOString(),
        exercises: item.exercises || [],
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load workouts." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }
    if (sessionUser.role !== "trainer" && sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const body = await request.json()
    const { userId, name, date, exercises } = body || {}

    if (!userId || !name || !date || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const assignedWorkout: AssignedWorkout = {
      trainerId: new ObjectId(sessionUser.id),
      userId: new ObjectId(userId),
      name: String(name).trim(),
      date: new Date(date),
      exercises: exercises.map((exercise: any) => ({
        name: String(exercise.name || "").trim(),
        sets: Number(exercise.sets || 0),
        reps: exercise.reps ?? 0,
        restTime: Number(exercise.restTime || 0),
        videoUrl: exercise.videoUrl ? String(exercise.videoUrl) : undefined,
        notes: exercise.notes ? String(exercise.notes) : undefined,
      })),
      createdAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection<AssignedWorkout>("assigned_workouts").insertOne(assignedWorkout)

    return NextResponse.json({
      workout: {
        id: result.insertedId.toString(),
        name: assignedWorkout.name,
        date: assignedWorkout.date.toISOString(),
        exercises: assignedWorkout.exercises,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign workout." }, { status: 500 })
  }
}

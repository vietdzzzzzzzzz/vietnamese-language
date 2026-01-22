import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

type WorkoutExercise = {
  name: string
  sets: number
  reps: number | string
  rest: number
  notes?: string
}

type TrainerWorkout = {
  _id?: ObjectId
  trainerId: ObjectId
  name: string
  category?: string
  difficulty?: string
  duration?: number
  exercises: WorkoutExercise[]
  createdAt: Date
}

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
    const workouts = await db
      .collection<TrainerWorkout>("trainer_workouts")
      .find({ trainerId: new ObjectId(sessionUser.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      workouts: workouts.map((item) => ({
        id: item._id?.toString() ?? "",
        name: item.name,
        category: item.category || "General",
        difficulty: item.difficulty || "Trung bình",
        duration: item.duration || 0,
        exercises: item.exercises || [],
        createdAt: item.createdAt?.toISOString?.() || new Date().toISOString(),
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
    const { name, category, difficulty, duration, exercises } = body || {}

    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: "Name and exercises are required." }, { status: 400 })
    }

    const workout: TrainerWorkout = {
      trainerId: new ObjectId(sessionUser.id),
      name: String(name).trim(),
      category: category ? String(category).trim() : "General",
      difficulty: difficulty ? String(difficulty).trim() : "Trung bình",
      duration: Number(duration) || 0,
      exercises: exercises.map((exercise: any) => ({
        name: String(exercise.name || "").trim(),
        sets: Number(exercise.sets || 0),
        reps: exercise.reps ?? 0,
        rest: Number(exercise.rest || 0),
        notes: exercise.notes ? String(exercise.notes) : undefined,
      })),
      createdAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection<TrainerWorkout>("trainer_workouts").insertOne(workout)

    return NextResponse.json({
      workout: {
        id: result.insertedId.toString(),
        name: workout.name,
        category: workout.category,
        difficulty: workout.difficulty,
        duration: workout.duration,
        exercises: workout.exercises,
        createdAt: workout.createdAt.toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout." }, { status: 500 })
  }
}

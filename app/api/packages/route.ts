import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { UserPackage } from "@/lib/models/User"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (userId) {
      const userPackage = await db
        .collection<UserPackage>("packages")
        .findOne({ userId: new ObjectId(userId), status: "active" })
      return NextResponse.json({ package: userPackage })
    }

    const packages = await db.collection<UserPackage>("packages").find({}).toArray()
    return NextResponse.json({ packages })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { userId, packageId, packageName, packageType, totalSessions, endDate } = body

    // Deactivate any existing active packages
    await db
      .collection<UserPackage>("packages")
      .updateMany(
        { userId: new ObjectId(userId), status: "active" },
        { $set: { status: "expired", updatedAt: new Date() } },
      )

    const newPackage: UserPackage = {
      userId: new ObjectId(userId),
      packageId,
      packageName,
      packageType,
      totalSessions,
      usedSessions: 0,
      startDate: new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<UserPackage>("packages").insertOne(newPackage)
    return NextResponse.json({ packageId: result.insertedId, package: newPackage })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("gymora")

    const body = await request.json()
    const { userId, updates } = body

    const result = await db
      .collection<UserPackage>("packages")
      .updateOne({ userId: new ObjectId(userId), status: "active" }, { $set: { ...updates, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

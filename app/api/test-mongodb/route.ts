import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("gymora_db")

    // Test query
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      success: true,
      message: "Kết nối MongoDB thành công!",
      database: "gymora_db",
      collections: collections.map((c) => c.name),
    })
  } catch (error: any) {
    console.error("[v0] MongoDB connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

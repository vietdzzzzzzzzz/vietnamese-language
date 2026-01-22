import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    
    // Test the connection by pinging the database
    await client.db("admin").command({ ping: 1 })
    
    const databases = await client.db().admin().listDatabases()
    
    return NextResponse.json({
      success: true,
      message: "✅ Kết nối MongoDB thành công!",
      databases: databases.databases.map((db) => db.name),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: "❌ Không thể kết nối với MongoDB",
        error: error instanceof Error ? error.message : "Unknown error",
        hint: "Kiểm tra MONGODB_URI trong file .env.local",
      },
      { status: 500 }
    )
  }
}

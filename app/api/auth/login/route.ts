import { NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    await createSession(user._id!)

    return NextResponse.json({
      user: {
        id: user._id?.toString() ?? "",
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to login." }, { status: 500 })
  }
}

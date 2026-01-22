import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

const ALLOWED_ROLES = new Set(["member", "trainer", "admin"])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body || {}

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
    }

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 })
    }

    const normalizedRole = ALLOWED_ROLES.has(role) ? role : "member"
    const hashedPassword = hashPassword(password)

    const userId = await createUser({
      email,
      password: hashedPassword,
      name,
      role: normalizedRole,
      currentWeight: 0,
      targetWeight: 0,
      streak: 0,
    })

    await createSession(userId)

    return NextResponse.json({
      user: {
        id: userId.toString(),
        email,
        name,
        role: normalizedRole,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register user." }, { status: 500 })
  }
}

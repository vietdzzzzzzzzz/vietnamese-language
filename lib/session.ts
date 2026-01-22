import crypto from "crypto"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getDatabase, getUserById } from "./db"

const SESSION_COOKIE_NAME = "gymora_session"
const SESSION_TTL_DAYS = 7

type SessionRecord = {
  token: string
  userId: ObjectId
  createdAt: Date
  expiresAt: Date
}

export async function createSession(userId: ObjectId) {
  const db = await getDatabase()
  const token = crypto.randomBytes(32).toString("hex")
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  await db.collection<SessionRecord>("sessions").insertOne({
    token,
    userId,
    createdAt: now,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const db = await getDatabase()

  if (token) {
    await db.collection<SessionRecord>("sessions").deleteOne({ token })
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const db = await getDatabase()
  const session = await db.collection<SessionRecord>("sessions").findOne({ token })
  if (!session) return null

  if (session.expiresAt < new Date()) {
    await db.collection<SessionRecord>("sessions").deleteOne({ token })
    return null
  }

  const user = await getUserById(session.userId)
  if (!user) return null

  return {
    id: user._id?.toString() ?? "",
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

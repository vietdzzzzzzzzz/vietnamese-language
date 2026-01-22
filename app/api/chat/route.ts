import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase, getUserById } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

type ChatMessageRecord = {
  _id?: ObjectId
  fromId: ObjectId
  toId: ObjectId
  fromName: string
  toName: string
  message: string
  createdAt: Date
  read: boolean
}

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherId = searchParams.get("otherId")
    if (!otherId) {
      return NextResponse.json({ error: "otherId required." }, { status: 400 })
    }

    const db = await getDatabase()
    const currentObjectId = new ObjectId(sessionUser.id)
    const otherObjectId = new ObjectId(otherId)

    const messages = await db
      .collection<ChatMessageRecord>("chat_messages")
      .find({
        $or: [
          { fromId: currentObjectId, toId: otherObjectId },
          { fromId: otherObjectId, toId: currentObjectId },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray()

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg._id?.toString() ?? "",
        fromId: msg.fromId.toString(),
        toId: msg.toId.toString(),
        fromName: msg.fromName,
        toName: msg.toName,
        message: msg.message,
        timestamp: msg.createdAt.toISOString(),
        read: msg.read,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await request.json()
    const { toId, message } = body || {}
    if (!toId || !message) {
      return NextResponse.json({ error: "toId and message required." }, { status: 400 })
    }

    const db = await getDatabase()
    const fromObjectId = new ObjectId(sessionUser.id)
    const toObjectId = new ObjectId(toId)

    const toUser = await getUserById(toObjectId)
    if (!toUser) {
      return NextResponse.json({ error: "Recipient not found." }, { status: 404 })
    }

    const newMessage: ChatMessageRecord = {
      fromId: fromObjectId,
      toId: toObjectId,
      fromName: sessionUser.name,
      toName: toUser.name,
      message: String(message).trim(),
      createdAt: new Date(),
      read: false,
    }

    const result = await db.collection<ChatMessageRecord>("chat_messages").insertOne(newMessage)

    return NextResponse.json({
      message: {
        id: result.insertedId.toString(),
        fromId: sessionUser.id,
        toId: toId,
        fromName: sessionUser.name,
        toName: toUser.name,
        message: newMessage.message,
        timestamp: newMessage.createdAt.toISOString(),
        read: false,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}

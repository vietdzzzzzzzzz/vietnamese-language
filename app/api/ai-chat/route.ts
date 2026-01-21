import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const runtime = "nodejs" // ✅ đổi khỏi edge để ổn định khi dev

const systemPrompt = `Bạn là AI Trainer chuyên nghiệp của GYMORA...`

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const messages = body?.messages

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const openai = createOpenAI({ apiKey })
    const model = openai("gpt-4o-mini")

    const lastUser =
      [...messages].reverse().find((m: any) => m?.role === "user")?.content ?? ""

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: String(lastUser),
      temperature: 0.7,
      maxOutputTokens: 1000,
    })

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

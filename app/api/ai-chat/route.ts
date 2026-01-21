export const maxDuration = 30
export const runtime = "nodejs"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          "Bạn là AI Trainer của GYMORA. Chỉ trả lời về gym, tập luyện, dinh dưỡng, lịch tập, phục hồi, động viên người dùng.",
      },
      ...messages,
    ],
  })

  const text =
    (response as any)?.output_text ||
    "Xin lỗi, tôi chưa thể trả lời lúc này."

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ")
      for (const word of words) {
        controller.enqueue(encoder.encode(`0:"${word} "\n`))
        await new Promise((r) => setTimeout(r, 20))
      }
      controller.enqueue(encoder.encode('0:""\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  })
}

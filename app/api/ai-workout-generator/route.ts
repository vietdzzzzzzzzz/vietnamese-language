import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const runtime = "nodejs"

const systemPrompt = `
Bạn là HLV chuyên tạo giáo án tập luyện.
Hãy trả về JSON thuần (không bọc markdown) với cấu trúc:
{
  "name": string,
  "description": string,
  "category": string,
  "difficulty": "Dễ" | "Trung bình" | "Khó",
  "duration": number,
  "targetMuscles": string[],
  "notes": string,
  "exercises": [
    { "name": string, "sets": number, "reps": number | string, "rest": number, "notes": string }
  ]
}
Trả lời tiếng Việt, ngắn gọn, thực tế.
`

const fallbackWorkout = (prompt: string) => ({
  name: "Workout Toàn thân",
  description: `Giáo án tổng quát dựa trên yêu cầu: ${prompt}`,
  category: "General",
  difficulty: "Trung bình",
  duration: 45,
  targetMuscles: ["Toàn thân"],
  notes: "Khởi động kỹ 5-10 phút trước khi tập.",
  exercises: [
    { name: "Squat", sets: 3, reps: 10, rest: 60, notes: "Giữ lưng thẳng" },
    { name: "Push-up", sets: 3, reps: 12, rest: 60, notes: "Siết core" },
    { name: "Plank", sets: 3, reps: "30-45s", rest: 45, notes: "Giữ thẳng lưng" },
  ],
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const prompt = String(body?.prompt || "").trim()

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt." }), {
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

    const { text } = await generateText({
      model,
      system: systemPrompt.trim(),
      prompt,
      temperature: 0.4,
      maxOutputTokens: 900,
    })

    let workout: any = null
    try {
      workout = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        workout = JSON.parse(match[0])
      }
    }

    if (!workout || !workout.name || !Array.isArray(workout.exercises)) {
      workout = fallbackWorkout(prompt)
    }

    return new Response(JSON.stringify({ workout }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

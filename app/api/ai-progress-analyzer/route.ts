import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const runtime = "nodejs"

type UserData = {
  totalWorkouts?: number
  startWeight?: number
  currentWeight?: number
  targetWeight?: number
  attendanceCount?: number
  durationWeeks?: number
}

const systemPrompt = `
Bạn là chuyên gia phân tích tiến độ tập luyện.
Hãy trả về JSON thuần (không bọc markdown) với các key:
- summary: string
- strengths: string[]
- improvements: string[]
- recommendations: string[]
- motivationalMessage: string
Trả lời tiếng Việt, thực tế, ngắn gọn, không phóng đại.
`

const buildFallback = (userData: UserData) => {
  const startWeight = userData.startWeight ?? 0
  const currentWeight = userData.currentWeight ?? 0
  const targetWeight = userData.targetWeight ?? 0
  const durationWeeks = userData.durationWeeks ?? 4
  const attendanceCount = userData.attendanceCount ?? 0
  const totalWorkouts = userData.totalWorkouts ?? 0

  const weightLoss = startWeight && currentWeight ? startWeight - currentWeight : 0
  const progressPercent =
    startWeight && targetWeight && startWeight !== targetWeight
      ? Math.max(0, Math.min(100, (weightLoss / (startWeight - targetWeight)) * 100))
      : 0

  return {
    summary: `Sau ${durationWeeks} tuần, bạn đã hoàn thành ${totalWorkouts} buổi tập và check-in ${attendanceCount} buổi gần đây. Tiến độ giảm cân đạt khoảng ${Math.round(
      progressPercent,
    )}% mục tiêu.`,
    strengths: [
      "Duy trì lịch tập khá đều, cho thấy sự kỷ luật tốt.",
      "Có tiến bộ rõ về thói quen tập luyện.",
    ],
    improvements: [
      "Tăng thêm độ ổn định lịch tập để giữ tiến độ bền vững.",
      "Theo dõi dinh dưỡng và nghỉ ngơi kỹ hơn để tối ưu phục hồi.",
    ],
    recommendations: [
      "Duy trì cường độ ổn định, ưu tiên kỹ thuật đúng.",
      "Thêm 1-2 buổi cardio nhẹ mỗi tuần nếu mục tiêu là giảm mỡ.",
    ],
    motivationalMessage: "Bạn đang đi đúng hướng. Cứ đều đặn từng tuần, mục tiêu sẽ tới gần!",
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const userData: UserData = body?.userData ?? {}

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const openai = createOpenAI({ apiKey })
    const model = openai("gpt-4o-mini")

    const prompt = `Dữ liệu người dùng (JSON): ${JSON.stringify(userData)}`

    const { text } = await generateText({
      model,
      system: systemPrompt.trim(),
      prompt,
      temperature: 0.4,
      maxOutputTokens: 800,
    })

    let analysis: any = null
    try {
      analysis = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        analysis = JSON.parse(match[0])
      }
    }

    if (
      !analysis ||
      typeof analysis.summary !== "string" ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.improvements) ||
      !Array.isArray(analysis.recommendations)
    ) {
      analysis = buildFallback(userData)
    }

    return new Response(JSON.stringify({ analysis }), {
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

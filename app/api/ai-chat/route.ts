export const maxDuration = 30

// Mock AI responses để demo
const mockResponses = [
  "Chào bạn! Tôi là AI Trainer của GYMORA. Tôi có thể giúp gì cho bạn hôm nay?",
  "Để tập hiệu quả, bạn nên:\n1. Khởi động 5-10 phút\n2. Tập chính 30-45 phút\n3. Thả lỏng cơ 5-10 phút\n\nĐừng quên uống đủ nước nhé!",
  "Về dinh dưỡng, bạn nên ăn đủ protein (1.6-2.2g/kg cơ thể), carb phức hợp và chất béo lốt. Chia nhỏ bữa ăn thành 5-6 bữa mỗi ngày.",
  "Kỹ thuật squat đúng:\n1. Chân rộng bằng vai\n2. Lưng thẳng, ngực mở\n3. Đẩy hông ra sau như ngồi ghế\n4. Xuống đến khi đùi song song với sàn\n5. Đẩy gót chân lên đứng\n\nLuyện tập từ từ với tạ nhẹ trước nhé!",
  "Để tăng cơ hiệu quả, bạn cần:\n- Tập nặng với 8-12 reps\n- Nghỉ đủ giấc (7-9 giờ)\n- Ăn thừa calories 300-500 cal/ngày\n- Uống đủ nước\n- Kiên trì ít nhất 3 tháng",
]

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Simulate streaming response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Get last user message
      const lastMessage = messages[messages.length - 1]
      const userText = lastMessage?.content || ""

      // Select response based on keywords
      let response = mockResponses[0]
      if (userText.toLowerCase().includes("dinh dưỡng") || userText.toLowerCase().includes("ăn")) {
        response = mockResponses[2]
      } else if (userText.toLowerCase().includes("squat") || userText.toLowerCase().includes("kỹ thuật")) {
        response = mockResponses[3]
      } else if (userText.toLowerCase().includes("tăng cơ") || userText.toLowerCase().includes("muscle")) {
        response = mockResponses[4]
      } else if (messages.length === 1) {
        response = mockResponses[0]
      } else {
        response = mockResponses[1]
      }

      // Stream response character by character
      const chunks = response.split(" ")
      for (const chunk of chunks) {
        const data = `0:"${chunk} "\n`
        controller.enqueue(encoder.encode(data))
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // End stream
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

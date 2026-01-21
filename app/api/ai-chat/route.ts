import { StreamingTextResponse } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

  let response = "Chào bạn! Tôi là AI Trainer của GYMORA. Tôi có thể giúp gì cho bạn hôm nay?"

  if (lastMessage.includes("dinh dưỡng") || lastMessage.includes("ăn")) {
    response =
      "Về dinh dưỡng, bạn nên ăn đủ protein (1.6–2.2g/kg), carb phức hợp và chất béo tốt. Chia nhỏ bữa ăn trong ngày để hấp thu tốt hơn."
  } else if (lastMessage.includes("squat")) {
    response =
      "Kỹ thuật squat đúng: chân rộng bằng vai, lưng thẳng, hạ hông ra sau như ngồi ghế, xuống đến khi đùi song song sàn, đẩy gót chân lên."
  } else if (lastMessage.includes("tăng cơ")) {
    response =
      "Để tăng cơ hiệu quả: tập 8–12 reps, ngủ 7–9 tiếng, ăn dư 300–500 kcal/ngày và duy trì ít nhất 8–12 tuần."
  }

  return new StreamingTextResponse(response)
}

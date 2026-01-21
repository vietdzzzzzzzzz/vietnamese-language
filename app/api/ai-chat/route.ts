export const maxDuration = 30;

const mockResponses = [
  "Chào bạn! Tôi là AI Trainer của GYMORA. Tôi có thể giúp gì cho bạn hôm nay?",
  "Để tập hiệu quả, bạn nên:\n- Khởi động 5–10 phút\n- Tập chính 30–45 phút\n- Thả lỏng 5–10 phút\nĐừng quên uống đủ nước nhé!",
  "Về dinh dưỡng: ăn đủ protein (1.6–2.2g/kg), carb tốt và chất béo lành mạnh.",
  "Kỹ thuật squat đúng: chân rộng bằng vai, lưng thẳng, đẩy hông ra sau, gót chân chịu lực.",
  "Muốn tăng cơ: tập 8–12 reps, ngủ đủ, ăn dư 300–500 kcal/ngày."
];

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  let reply = mockResponses[1];

  if (lastMessage.includes("dinh dưỡng") || lastMessage.includes("ăn")) {
    reply = mockResponses[2];
  } else if (lastMessage.includes("squat")) {
    reply = mockResponses[3];
  } else if (lastMessage.includes("tăng cơ")) {
    reply = mockResponses[4];
  } else if (messages.length === 1) {
    reply = mockResponses[0];
  }

  return Response.json({
    role: "assistant",
    content: reply,
  });
}

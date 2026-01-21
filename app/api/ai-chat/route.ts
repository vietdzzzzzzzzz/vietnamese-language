export const runtime = "edge";

const mockResponses = [
  "Chào bạn! Tôi là AI Trainer của GYMORA. Tôi có thể giúp gì cho bạn hôm nay?",
  "Để tập hiệu quả, bạn nên:\n- Khởi động 5–10 phút\n- Tập chính 30–45 phút\n- Thả lỏng 5–10 phút\n- Uống đủ nước",
  "Về dinh dưỡng: ăn đủ protein (1.6–2.2g/kg), carb phức hợp, chất béo tốt. Chia 4–5 bữa/ngày.",
  "Kỹ thuật squat đúng:\n1. Chân rộng bằng vai\n2. Lưng thẳng\n3. Đẩy hông ra sau\n4. Xuống đến khi đùi song song sàn\n5. Đẩy gót đứng lên",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body?.messages ?? [];
    const lastMessage =
      messages.length > 0
        ? String(messages[messages.length - 1].content || "").toLowerCase()
        : "";

    let response = mockResponses[1];

    if (messages.length === 1) response = mockResponses[0];
    else if (lastMessage.includes("dinh dưỡng") || lastMessage.includes("ăn"))
      response = mockResponses[2];
    else if (lastMessage.includes("squat") || lastMessage.includes("kỹ thuật"))
      response = mockResponses[3];

    return Response.json({ content: response });
  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    return new Response(
      JSON.stringify({ content: "❌ Lỗi AI backend" }),
      { status: 500 }
    );
  }
}

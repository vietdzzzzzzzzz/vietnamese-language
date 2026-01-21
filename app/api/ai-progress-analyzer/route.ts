export async function POST(req: Request) {
  const { userData } = await req.json()

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Calculate progress metrics
  const weightLoss = (userData.startWeight || 75) - (userData.currentWeight || 72)
  const progressPercent = ((weightLoss / ((userData.startWeight || 75) - (userData.targetWeight || 68))) * 100).toFixed(
    0,
  )
  const strengthGain = ((userData.currentSquat || 97) / (userData.startSquat || 80) - 1) * 100

  const analysis = {
    summary: `Sau ${userData.duration || "4 tuần"} tập luyện, bạn đã giảm được ${weightLoss}kg (đạt ${progressPercent}% mục tiêu) và tăng sức mạnh squat ${strengthGain.toFixed(0)}%. Tỷ lệ tham gia lớp ${userData.attendance || 85}% cho thấy sự cam kết tốt của bạn.`,

    strengths: [
      `Tỷ lệ tham gia ${userData.attendance || 85}% rất ấn tượng, cho thấy sự kiên trì`,
      `Sức mạnh squat tăng ${strengthGain.toFixed(0)}% - tiến bộ vượt mức trung bình`,
      `Giảm cân ${weightLoss}kg một cách an toàn và bền vững`,
      "Duy trì kỷ luật tập luyện đều đặn",
    ],

    improvements: [
      "Có thể tăng cường độ tập cardio để đốt mỡ nhanh hơn",
      "Nên theo dõi lượng protein hàng ngày (1.6-2g/kg cơ thể)",
      "Có thể thêm 1 buổi tập chân nữa trong tuần",
      "Cân nhắc bổ sung vitamin và khoáng chất",
    ],

    recommendations: [
      `Để đạt mục tiêu ${userData.targetWeight || 68}kg, hãy tiếp tục với tốc độ giảm 0.5kg/tuần`,
      "Tăng trọng lượng squat lên 5% mỗi 2 tuần nếu kỹ thuật tốt",
      "Thêm 15-20 phút HIIT cardio vào 2-3 buổi/tuần",
      "Ưu tiên ngủ 7-9 giờ mỗi đêm để cơ bắp hồi phục tốt",
      "Uống 2.5-3L nước mỗi ngày",
    ],

    motivationalMessage: `Xuất sắc! Bạn đang trên đà rất tốt với ${progressPercent}% tiến độ đã hoàn thành. Sức mạnh tăng ${strengthGain.toFixed(0)}% chứng tỏ phương pháp tập của bạn đang hiệu quả. Hãy tiếp tục duy trì động lực - mục tiêu ${userData.targetWeight || 68}kg đang ở rất gần! 💪`,
  }

  return Response.json({ analysis })
}

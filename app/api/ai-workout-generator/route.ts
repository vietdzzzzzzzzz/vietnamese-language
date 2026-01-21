export async function POST(req: Request) {
  const { prompt } = await req.json()

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock workout based on prompt keywords
  let workout
  if (prompt.toLowerCase().includes("ngực") || prompt.toLowerCase().includes("chest")) {
    workout = {
      name: "Workout Ngực Toàn Diện",
      description: "Tập trung phát triển cơ ngực với các bài tập compound và isolation",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: 8, rest: 90, notes: "Giữ cẳng tay vuông góc 90 độ" },
        { name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: 75, notes: "Góc nghiêng 30-45 độ" },
        { name: "Cable Flyes", sets: 3, reps: 12, rest: 60, notes: "Kéo chậm, cảm nhận cơ ngực" },
        { name: "Push-ups", sets: 3, reps: "Max", rest: 60, notes: "Hạ thấp hoàn toàn" },
        { name: "Dips", sets: 3, reps: 10, rest: 60, notes: "Nghiêng người về phía trước" },
      ],
      duration: 45,
      difficulty: "Trung bình" as const,
      targetMuscles: ["Ngực", "Vai trước", "Tay sau"],
      notes: "Khởi động kỹ khớp vai trước khi tập. Nghỉ 2-3 ngày giữa các buổi tập ngực.",
    }
  } else if (prompt.toLowerCase().includes("lưng") || prompt.toLowerCase().includes("back")) {
    workout = {
      name: "Workout Lưng Mạnh Mẽ",
      description: "Phát triển độ dày và rộng cho lưng",
      exercises: [
        { name: "Deadlift", sets: 4, reps: 6, rest: 120, notes: "Giữ lưng thẳng suốt động tác" },
        { name: "Pull-ups", sets: 3, reps: 10, rest: 90, notes: "Kéo ngực chạm xà" },
        { name: "Barbell Row", sets: 4, reps: 8, rest: 75, notes: "Nghiêng 45 độ, kéo vào thắt lưng" },
        { name: "Lat Pulldown", sets: 3, reps: 12, rest: 60, notes: "Kéo xuống ngang ngực" },
        { name: "Face Pulls", sets: 3, reps: 15, rest: 60, notes: "Tập trung vào vai sau" },
      ],
      duration: 50,
      difficulty: "Khó" as const,
      targetMuscles: ["Lưng xô", "Lưng dưới", "Vai sau"],
      notes: "Deadlift là bài tập quan trọng nhất. Đảm bảo kỹ thuật đúng để tránh chấn thương lưng.",
    }
  } else if (prompt.toLowerCase().includes("chân") || prompt.toLowerCase().includes("leg")) {
    workout = {
      name: "Workout Chân Toàn Diện",
      description: "Xây dựng nền tảng sức mạnh từ chân",
      exercises: [
        { name: "Barbell Squat", sets: 4, reps: 8, rest: 120, notes: "Xuống song song sàn, lưng thẳng" },
        { name: "Leg Press", sets: 4, reps: 12, rest: 90, notes: "Chân rộng bằng vai" },
        { name: "Romanian Deadlift", sets: 3, reps: 10, rest: 75, notes: "Cảm nhận kéo giãn cơ sau đùi" },
        { name: "Leg Extension", sets: 3, reps: 15, rest: 60, notes: "Động tác chậm, kiểm soát" },
        { name: "Leg Curl", sets: 3, reps: 15, rest: 60, notes: "Không xoay hông" },
        { name: "Calf Raises", sets: 4, reps: 20, rest: 45, notes: "Lên cao nhất có thể" },
      ],
      duration: 55,
      difficulty: "Khó" as const,
      targetMuscles: ["Đùi trước", "Đùi sau", "Mông", "Bắp chân"],
      notes: "Ngày tập chân cần năng lượng cao. Khởi động kỹ khớp gối và hông trước khi tập nặng.",
    }
  } else {
    workout = {
      name: "Full Body Workout",
      description: "Bài tập toàn thân cho người mới bắt đầu",
      exercises: [
        { name: "Goblet Squat", sets: 3, reps: 12, rest: 60, notes: "Giữ tạ trước ngực" },
        { name: "Push-ups", sets: 3, reps: 12, rest: 60, notes: "Có thể chống tay lên ghế nếu khó" },
        { name: "Dumbbell Row", sets: 3, reps: 10, rest: 60, notes: "Mỗi tay một set" },
        { name: "Shoulder Press", sets: 3, reps: 10, rest: 60, notes: "Đứng hoặc ngồi đều được" },
        { name: "Plank", sets: 3, reps: "30-60s", rest: 45, notes: "Giữ thân thẳng" },
      ],
      duration: 40,
      difficulty: "Dễ" as const,
      targetMuscles: ["Toàn thân"],
      notes: "Hoàn hảo cho người mới. Tập 3 lần/tuần, nghỉ 1 ngày giữa các buổi tập.",
    }
  }

  return Response.json({ workout })
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, CheckCircle2, Dumbbell } from "lucide-react"
import { ExerciseDetailDialog } from "./exercise-detail-dialog"
import type { WorkoutExercise } from "@/types/exercise"

// Sample exercises data with sets, reps, and rest time
const exercisesData = [
  {
    id: 1,
    name: "Squat",
    category: "Legs",
    difficulty: "Trung bình" as const,
    equipment: "Barbell",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    description: "Động tác cơ bản nhất để phát triển chân, mông và cơ lưng dưới.",
    instructions: [
      "Đứng thẳng, chân rộng bằng vai, ngón chân hơi xoay ra ngoài",
      "Đặt thanh tạ lên vai sau, giữ lưng thẳng",
      "Hít vào, từ từ hạ người xuống như đang ngồi xuống ghế",
      "Đùi song song với mặt đất hoặc sâu hơn",
      "Thở ra, đẩy gót chân để đứng lên",
    ],
    tips: ["Giữ đầu gối không vượt quá mũi bàn chân", "Lưng luôn thẳng", "Nhìn thẳng về phía trước"],
    videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
  },
  {
    id: 2,
    name: "Bench Press",
    category: "Chest",
    difficulty: "Trung bình" as const,
    equipment: "Barbell",
    muscles: ["Pectoralis", "Triceps", "Anterior Deltoids"],
    description: "Bài tập cơ bản để phát triển ngực, vai trước và tay sau.",
    instructions: [
      "Nằm ngửa trên ghế, lưng ép sát ghế",
      "Nắm thanh tạ rộng hơn vai, tay thẳng",
      "Hít vào, hạ thanh tạ xuống giữa ngực",
      "Chạm nhẹ vào ngực",
      "Thở ra, đẩy thanh tạ lên về vị trí ban đầu",
    ],
    tips: ["Chân đặt chắc trên sàn", "Vai không rời khỏi ghế", "Khuỷu tay góc 45 độ"],
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
  },
  {
    id: 3,
    name: "Deadlift",
    category: "Back",
    difficulty: "Khó" as const,
    equipment: "Barbell",
    muscles: ["Erector Spinae", "Glutes", "Hamstrings", "Traps"],
    description: "Động tác tổng hợp phát triển toàn thân, đặc biệt lưng và chân.",
    instructions: [
      "Đứng trước thanh tạ, chân rộng bằng hông",
      "Cúi xuống nắm thanh, tay rộng hơn chân",
      "Giữ lưng thẳng, ngực đẩy ra",
      "Hít vào, kéo thanh lên bằng cách duỗi hông và đầu gối",
      "Đứng thẳng hoàn toàn, vai ra sau",
      "Hạ thanh xuống với động tác ngược lại",
    ],
    tips: ["QUAN TRỌNG: Lưng luôn thẳng", "Thanh sát với người", "Kéo bằng chân và hông, không phải lưng"],
  },
  {
    id: 4,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Khó" as const,
    equipment: "Pull-up Bar",
    muscles: ["Latissimus Dorsi", "Biceps", "Traps"],
    description: "Bài tập tuyệt vời cho lưng xô và tay trước.",
    instructions: [
      "Treo người trên xà, tay nắm rộng hơn vai",
      "Người thẳng, chân gập hoặc duỗi",
      "Kéo người lên cho đến khi cằm vượt qua xà",
      "Giữ 1 giây ở trên",
      "Hạ người xuống từ từ về vị trí ban đầu",
    ],
    tips: ["Không xoay người", "Vai không co lại", "Động tác chậm và kiểm soát"],
  },
]

const workouts = [
  {
    id: 1,
    name: "Ngày chân - Squat Focus",
    exercises: [
      { exercise: exercisesData[0], sets: 4, reps: "8-10", restTime: 90, notes: "Tăng trọng lượng dần qua các set" },
      { exercise: { ...exercisesData[0], id: 11, name: "Leg Press" }, sets: 3, reps: "12-15", restTime: 60 },
      { exercise: { ...exercisesData[0], id: 12, name: "Lunges" }, sets: 3, reps: "10", restTime: 45 },
      { exercise: { ...exercisesData[0], id: 13, name: "Leg Curl" }, sets: 3, reps: "12", restTime: 45 },
    ],
    duration: 60,
    calories: 350,
    completed: true,
    date: "2025-01-28",
  },
  {
    id: 2,
    name: "Ngày ngực - Bench Press",
    exercises: [
      { exercise: exercisesData[1], sets: 4, reps: "8-10", restTime: 120, notes: "Tập trung vào form đúng" },
      { exercise: { ...exercisesData[1], id: 21, name: "Incline Press" }, sets: 3, reps: "10-12", restTime: 90 },
      { exercise: { ...exercisesData[1], id: 22, name: "Flyes" }, sets: 3, reps: "12-15", restTime: 60 },
      { exercise: { ...exercisesData[1], id: 23, name: "Dips" }, sets: 3, reps: "8-12", restTime: 75 },
    ],
    duration: 50,
    calories: 300,
    completed: true,
    date: "2025-01-26",
  },
  {
    id: 3,
    name: "Ngày lưng - Deadlift",
    exercises: [
      { exercise: exercisesData[2], sets: 5, reps: "5", restTime: 180, notes: "Ưu tiên kỹ thuật, không vội tăng trọng lượng" },
      { exercise: exercisesData[3], sets: 4, reps: "6-8", restTime: 120 },
      { exercise: { ...exercisesData[2], id: 31, name: "Barbell Rows" }, sets: 4, reps: "8-10", restTime: 90 },
      { exercise: { ...exercisesData[2], id: 32, name: "Lat Pulldown" }, sets: 3, reps: "12-15", restTime: 60 },
    ],
    duration: 55,
    calories: 320,
    completed: false,
    date: "2025-01-30",
  },
]

export function WorkoutList() {
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleExerciseClick = (workoutExercise: WorkoutExercise) => {
    setSelectedExercise(workoutExercise)
    setIsDialogOpen(true)
  }

  // Get user ID from session storage
  const getUserId = () => {
    const userData = sessionStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      return user.id || "guest"
    }
    return "guest"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lịch tập của bạn</h2>
        <Button>Tạo bài tập mới với AI</Button>
      </div>

      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {workout.name}
                  {workout.completed && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{workout.date}</p>
              </div>
              <Badge variant={workout.completed ? "default" : "secondary"}>
                {workout.completed ? "Hoàn thành" : "Sắp tới"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Các bài tập:</p>
                <div className="grid gap-2">
                  {workout.exercises.map((workoutExercise, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => handleExerciseClick(workoutExercise)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Dumbbell className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <p className="font-medium">{workoutExercise.exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {workoutExercise.sets} sets × {workoutExercise.reps} reps • Nghỉ {workoutExercise.restTime}s
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Chi tiết
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {workout.duration} phút
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  {workout.calories} cal
                </div>
              </div>
              {!workout.completed && <Button className="w-full">Bắt đầu tập</Button>}
            </div>
          </CardContent>
        </Card>
      ))}

      <ExerciseDetailDialog
        workoutExercise={selectedExercise}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={getUserId()}
      />
    </div>
  )
}
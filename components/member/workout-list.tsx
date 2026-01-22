"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, CheckCircle2, Dumbbell } from "lucide-react"
import { ExerciseDetailDialog } from "./exercise-detail-dialog"
import type { WorkoutExercise } from "@/types/exercise"

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

type WorkoutListProps = {
  userId?: string
  currentWeight?: number
}

export function WorkoutList({ userId, currentWeight }: WorkoutListProps) {
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<number, boolean>>({})
  const [savingWorkoutId, setSavingWorkoutId] = useState<number | null>(null)
  const [assignedWorkouts, setAssignedWorkouts] = useState<any[]>([])
  const [loadingWorkouts, setLoadingWorkouts] = useState(true)

  useEffect(() => {
    if (!userId) return
    let isMounted = true

    const loadAssignedWorkouts = async () => {
      try {
        const response = await fetch(`/api/assigned-workouts?userId=${userId}`)
        if (!response.ok) return
        const data = await response.json()
        const items = Array.isArray(data?.workouts) ? data.workouts : []
        if (isMounted) {
          setAssignedWorkouts(items)
        }
      } finally {
        if (isMounted) {
          setLoadingWorkouts(false)
        }
      }
    }

    loadAssignedWorkouts()
    return () => {
      isMounted = false
    }
  }, [userId])

  const buildExercise = (name: string, videoUrl?: string) => {
    const base = exercisesData.find((exercise) => exercise.name === name)
    if (base) return base
    return {
      id: name,
      name,
      category: "Custom",
      difficulty: "Trung bình" as const,
      equipment: "Không rõ",
      muscles: ["Toàn thân"],
      description: "Bài tập được HLV giao.",
      instructions: ["Thực hiện theo hướng dẫn của HLV."],
      tips: ["Giữ kỹ thuật đúng và an toàn."],
      videoUrl,
    }
  }

  const workouts = assignedWorkouts.map((workout, index) => ({
    id: index + 1,
    name: workout.name,
    exercises: (workout.exercises || []).map((exercise: any, exIndex: number) => ({
      exercise: buildExercise(exercise.name, exercise.videoUrl),
      sets: exercise.sets,
      reps: exercise.reps,
      restTime: exercise.restTime,
      notes: exercise.notes,
      id: exIndex + 1,
    })),
    duration: 45,
    calories: 0,
    completed: false,
    date: workout.date,
  }))

  const handleExerciseClick = (workoutExercise: WorkoutExercise) => {
    setSelectedExercise(workoutExercise)
    setIsDialogOpen(true)
  }

  const handleCompleteWorkout = async (workoutId: number) => {
    if (!userId) return
    const workout = workouts.find((item) => item.id === workoutId)
    if (!workout) return

    setSavingWorkoutId(workoutId)
    try {
      const exercises = workout.exercises.map((exercise) => ({
        name: exercise.exercise.name,
        sets: exercise.sets,
        reps: typeof exercise.reps === "string" ? Number.parseInt(exercise.reps, 10) || 0 : exercise.reps,
        weight: 0,
      }))

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: new Date().toISOString(),
          weight: currentWeight || undefined,
          exercises,
          notes: workout.name,
        }),
      })

      if (response.ok) {
        setCompletedWorkouts((prev) => ({ ...prev, [workoutId]: true }))
      }
    } finally {
      setSavingWorkoutId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lịch tập của bạn</h2>
      </div>

      {loadingWorkouts ? (
        <p className="text-sm text-muted-foreground">Đang tải lịch tập...</p>
      ) : workouts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Chưa có bài tập được giao.
          </CardContent>
        </Card>
      ) : (
        workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {workout.name}
                    {(workout.completed || completedWorkouts[workout.id]) && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{workout.date}</p>
                </div>
                <Badge variant={workout.completed || completedWorkouts[workout.id] ? "default" : "secondary"}>
                  {workout.completed || completedWorkouts[workout.id] ? "Hoàn thành" : "Sắp tới"}
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
                              {workoutExercise.sets} sets × {workoutExercise.reps} reps • Nghỉ{" "}
                              {workoutExercise.restTime}s
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
                {!workout.completed && !completedWorkouts[workout.id] && (
                  <Button
                    className="w-full"
                    onClick={() => handleCompleteWorkout(workout.id)}
                    disabled={savingWorkoutId === workout.id}
                  >
                    {savingWorkoutId === workout.id ? "Đang lưu..." : "Hoàn thành"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <ExerciseDetailDialog
        workoutExercise={selectedExercise}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={userId || "guest"}
      />
    </div>
  )
}

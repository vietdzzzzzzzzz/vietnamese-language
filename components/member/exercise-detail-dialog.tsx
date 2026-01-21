"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Timer, RefreshCw, TrendingUp, History, Play } from "lucide-react"
import type { WorkoutExercise, ExerciseHistory } from "@/types/exercise"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ExerciseDetailDialogProps {
  workoutExercise: WorkoutExercise | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function ExerciseDetailDialog({
  workoutExercise,
  open,
  onOpenChange,
  userId,
}: ExerciseDetailDialogProps) {
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [isResting, setIsResting] = useState(false)

  useEffect(() => {
    if (workoutExercise && open) {
      loadExerciseHistory()
    }
  }, [workoutExercise, open, userId])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isResting && restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))
      }, 1000)
    } else if (restTimer === 0) {
      setIsResting(false)
      setRestTimer(null)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isResting, restTimer])

  const loadExerciseHistory = () => {
    if (!workoutExercise) return
    const historyKey = `exercise_history_${userId}_${workoutExercise.exercise.id}`
    const savedHistory = localStorage.getItem(historyKey)
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory)
      const historyWithDates = parsed.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }))
      setExerciseHistory(historyWithDates)
    }
  }

  const startRestTimer = () => {
    if (!workoutExercise) return
    setRestTimer(workoutExercise.restTime)
    setIsResting(true)
  }

  const completeSet = () => {
    if (!workoutExercise) return
    if (currentSet < workoutExercise.sets) {
      setCurrentSet((prev) => prev + 1)
      startRestTimer()
    } else {
      // Log workout completion
      logWorkout()
      setCurrentSet(1)
    }
  }

  const logWorkout = () => {
    if (!workoutExercise) return
    const newHistory: ExerciseHistory = {
      id: `${Date.now()}`,
      userId,
      exerciseId: workoutExercise.exercise.id,
      exerciseName: workoutExercise.exercise.name,
      date: new Date(),
      sets: Array.from({ length: workoutExercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: typeof workoutExercise.reps === "string" ? 10 : workoutExercise.reps,
        completed: true,
      })),
    }

    const historyKey = `exercise_history_${userId}_${workoutExercise.exercise.id}`
    const existingHistory = localStorage.getItem(historyKey)
    const updatedHistory = existingHistory
      ? [...JSON.parse(existingHistory), newHistory]
      : [newHistory]
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
    setExerciseHistory(updatedHistory.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    })))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!workoutExercise) return null

  const { exercise, sets, reps, restTime, notes } = workoutExercise

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Dumbbell className="w-6 h-6 text-primary" />
            {exercise.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instructions">Hướng dẫn</TabsTrigger>
            <TabsTrigger value="workout">Bài tập</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="space-y-6">
            {exercise.videoUrl && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={exercise.videoUrl}
                  title={exercise.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div>
              <p className="text-muted-foreground leading-relaxed">{exercise.description}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Độ khó</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="text-base">{exercise.difficulty}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Dụng cụ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{exercise.equipment}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Nhóm cơ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">Các bước thực hiện:</h3>
              <ol className="space-y-3">
                {exercise.instructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">
                Lưu ý quan trọng:
              </h3>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed text-orange-900 dark:text-orange-100">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Số Set
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{sets}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Số Reps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{reps}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Thời gian nghỉ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{restTime}s</p>
                </CardContent>
              </Card>
            </div>

            {notes && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-900 dark:text-blue-100">{notes}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tiến độ bài tập</span>
                  <Badge variant="secondary">
                    Set {currentSet}/{sets}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={(currentSet / sets) * 100} className="h-3" />

                {isResting && restTimer !== null ? (
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold text-primary">{formatTime(restTimer)}</div>
                    <p className="text-muted-foreground">Đang nghỉ ngơi...</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsResting(false)
                        setRestTimer(null)
                      }}
                    >
                      Bỏ qua nghỉ
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-muted-foreground">
                      {currentSet <= sets ? `Đang thực hiện set ${currentSet}` : "Hoàn thành bài tập!"}
                    </p>
                    <Button className="w-full" size="lg" onClick={completeSet} disabled={currentSet > sets}>
                      <Play className="w-4 h-4 mr-2" />
                      {currentSet < sets ? "Hoàn thành set" : "Hoàn thành bài tập"}
                    </Button>
                    {currentSet > 1 && currentSet <= sets && (
                      <Button variant="outline" className="w-full" onClick={startRestTimer}>
                        <Timer className="w-4 h-4 mr-2" />
                        Bắt đầu nghỉ ({restTime}s)
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {exerciseHistory.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Chưa có lịch sử tập luyện
                    <br />
                    Hoàn thành bài tập đầu tiên để bắt đầu theo dõi!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {exerciseHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <Card key={record.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {format(new Date(record.date), "dd/MM/yyyy - HH:mm", { locale: vi })}
                          </CardTitle>
                          <Badge variant="outline">
                            {record.sets.length} sets hoàn thành
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {record.sets.map((set) => (
                            <div
                              key={set.setNumber}
                              className="p-3 bg-muted rounded-lg text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-1">Set {set.setNumber}</p>
                              <p className="text-lg font-semibold">{set.reps} reps</p>
                              {set.weight && (
                                <p className="text-xs text-muted-foreground">{set.weight} kg</p>
                              )}
                            </div>
                          ))}
                        </div>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground mt-3 italic">{record.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
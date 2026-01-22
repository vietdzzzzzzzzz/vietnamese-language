"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Copy, Edit, Trash2, Brain, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type WorkoutExercise = {
  name: string
  sets: number
  reps: number | string
  rest: number
  notes?: string
}

type TrainerWorkout = {
  id: string
  name: string
  category: string
  difficulty: string
  duration: number
  exercises: WorkoutExercise[]
}

export function WorkoutManagement() {
  const [workouts, setWorkouts] = useState<TrainerWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [openManual, setOpenManual] = useState(false)
  const [manualError, setManualError] = useState<string | null>(null)
  const [manualName, setManualName] = useState("")
  const [manualCategory, setManualCategory] = useState("")
  const [manualDifficulty, setManualDifficulty] = useState("Trung bình")
  const [manualDuration, setManualDuration] = useState(45)
  const [manualExercises, setManualExercises] = useState<WorkoutExercise[]>([])

  useEffect(() => {
    let isMounted = true
    const loadWorkouts = async () => {
      try {
        const response = await fetch("/api/trainer/workouts")
        if (!response.ok) return
        const data = await response.json()
        const list = Array.isArray(data?.workouts) ? data.workouts : []
        if (isMounted) {
          setWorkouts(list)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()
    return () => {
      isMounted = false
    }
  }, [])

  const createWorkout = async (workout: Omit<TrainerWorkout, "id">) => {
    const response = await fetch("/api/trainer/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const saved = data?.workout as TrainerWorkout | undefined
    if (saved) {
      setWorkouts((prev) => [saved, ...prev])
    }
    return saved ?? null
  }

  const resetManualForm = () => {
    setManualName("")
    setManualCategory("")
    setManualDifficulty("Trung bình")
    setManualDuration(45)
    setManualExercises([])
  }

  const handleManualSave = async () => {
    if (!manualName.trim()) {
      setManualError("Vui l?ng nh?p t?n b?i t?p.")
      return
    }
    if (manualExercises.length == 0) {
      setManualError("Vui l?ng th?m ?t nh?t 1 b?i t?p.")
      return
    }
    if (manualExercises.some((exercise) => !exercise.name.trim())) {
      setManualError("T?n b?i t?p kh?ng ???c ?? tr?ng.")
      return
    }
    setManualError(null)
    const created = await createWorkout({
      name: manualName.trim(),
      category: manualCategory.trim() || "General",
      difficulty: manualDifficulty.trim() || "Trung bình",
      duration: manualDuration,
      exercises: manualExercises,
    })
    if (created) {
      resetManualForm()
      setOpenManual(false)
    }
  }

  const addManualExercise = () => {
    setManualExercises((prev) => [
      ...prev,
      { name: "", sets: 3, reps: 10, rest: 60 },
    ])
  }

  const updateManualExercise = (index: number, key: keyof WorkoutExercise, value: any) => {
    setManualExercises((prev) =>
      prev.map((exercise, idx) => (idx === index ? { ...exercise, [key]: value } : exercise)),
    )
  }

  const removeManualExercise = (index: number) => {
    setManualExercises((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bài tập</h2>
        <div className="flex gap-2">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Tạo bài với AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo bài tập với AI</DialogTitle>
              </DialogHeader>
              <AIWorkoutCreator
                onClose={() => setOpenCreate(false)}
                onSave={async (workout) => {
                  const saved = await createWorkout(workout)
                  if (saved) {
                    setOpenCreate(false)
                  }
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openManual} onOpenChange={setOpenManual}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo bài tập mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Tạo bài tập thủ công</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tên bài tập</Label>
                    <Input value={manualName} onChange={(e) => setManualName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Danh mục</Label>
                    <Input
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                      placeholder="VD: Full body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Độ khó</Label>
                    <Input
                      value={manualDifficulty}
                      onChange={(e) => setManualDifficulty(e.target.value)}
                      placeholder="Dễ / Trung bình / Khó"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Thời lượng (phút)</Label>
                    <Input
                      type="number"
                      value={manualDuration}
                      onChange={(e) => setManualDuration(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-base">Bài tập trong buổi</Label>
                  <Button variant="outline" size="sm" onClick={addManualExercise}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Thêm bài tập
                  </Button>
                </div>

                {manualExercises.length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-sm text-muted-foreground">
                      Chưa có bài tập nào. Nhấn "Thêm bài tập" để bắt đầu.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {manualExercises.map((exercise, index) => (
                      <Card key={`${exercise.name}-${index}`}>
                        <CardContent className="space-y-3 pt-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Bài tập {index + 1}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeManualExercise(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-4">
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Tên bài tập</Label>
                              <Input
                                value={exercise.name}
                                onChange={(e) => updateManualExercise(index, "name", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Sets</Label>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  updateManualExercise(index, "sets", Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Reps</Label>
                              <Input
                                value={exercise.reps}
                                onChange={(e) => updateManualExercise(index, "reps", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nghỉ (giây)</Label>
                              <Input
                                type="number"
                                value={exercise.rest}
                                onChange={(e) =>
                                  updateManualExercise(index, "rest", Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="sm:col-span-3 space-y-2">
                              <Label>Ghi chú</Label>
                              <Input
                                value={exercise.notes || ""}
                                onChange={(e) =>
                                  updateManualExercise(index, "notes", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {manualError ? (
                  <p className="text-sm text-red-600">{manualError}</p>
                ) : null}
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleManualSave} disabled={!manualName.trim()}>
                    Lưu bài tập
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      resetManualForm()
                      setOpenManual(false)
                    }}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Đang tải danh sách bài tập...</div>
      ) : workouts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Chưa có bài tập nào. Hãy tạo bài tập mới để bắt đầu.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{workout.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{workout.category}</Badge>
                      <Badge>{workout.difficulty}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Các bài tập:</p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.map((exercise, index) => (
                        <Badge key={`${exercise.name}-${index}`} variant="secondary">
                          {exercise.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Thời lượng: {workout.duration} phút</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Copy className="w-4 h-4 mr-2" />
                      Sao chép
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AIWorkoutCreator({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (workout: Omit<TrainerWorkout, "id">) => void
}) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const generateWorkout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-workout-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      setResult(data.workout)
    } catch (error) {
      console.error("Error generating workout:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Mô tả yêu cầu</Label>
          <Textarea
            placeholder="VD: Tạo bài tập cho người mới bắt đầu, tập 3 ngày/tuần, tập toàn thân..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>
        <Button onClick={generateWorkout} disabled={loading || !prompt} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            "Tạo bài tập với AI"
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30 max-h-[400px] overflow-y-auto">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{result.name}</h3>
              <Badge>{result.difficulty}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground mb-4">
              <span>Thời lượng: {result.duration} phút</span>
              <span>Nhóm cơ: {result.targetMuscles?.join(", ")}</span>
            </div>
            {result.notes && (
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <p className="text-sm leading-relaxed">{result.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {result.exercises?.map((exercise: any, index: number) => (
              <div key={index} className="p-3 bg-background rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{exercise.name}</p>
                  <Badge variant="outline">Nghỉ {exercise.rest}s</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets x {exercise.reps} reps
                </p>
                {exercise.notes && <p className="text-xs text-muted-foreground italic">{exercise.notes}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() =>
                onSave({
                  name: result.name,
                  category: result.category || "General",
                  difficulty: result.difficulty || "Trung bình",
                  duration: Number(result.duration) || 0,
                  exercises: result.exercises || [],
                })
              }
            >
              Lưu bài tập
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

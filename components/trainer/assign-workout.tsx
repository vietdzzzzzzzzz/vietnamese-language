"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, PlusCircle, Trash2, Video } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  rest: number
  videoUrl?: string
  notes?: string
}

interface Client {
  id: string
  name: string
  email: string
}

const exerciseTemplates = [
  { name: "Squat", videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8" },
  { name: "Bench Press", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg" },
  { name: "Deadlift", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q" },
  { name: "Pull-ups", videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g" },
  { name: "Shoulder Press", videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog" },
  { name: "Bicep Curls", videoUrl: "" },
  { name: "Tricep Dips", videoUrl: "" },
  { name: "Lunges", videoUrl: "" },
]

export function AssignWorkout() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDate, setWorkoutDate] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadClients = async () => {
      try {
        const response = await fetch("/api/trainer/members")
        if (!response.ok) return
        const data = await response.json()
        const members = Array.isArray(data?.members) ? data.members : []
        if (isMounted) {
          setClients(
            members.map((member: any) => ({
              id: member.id,
              name: member.name,
              email: member.email,
            })),
          )
        }
      } finally {
        if (isMounted) {
          setLoadingClients(false)
        }
      }
    }

    loadClients()
    return () => {
      isMounted = false
    }
  }, [])

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: 3,
      reps: 10,
      rest: 60,
    }
    setExercises((prev) => [...prev, newExercise])
  }

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id))
  }

  useEffect(() => {
    if (isOpen && exercises.length === 0) {
      addExercise()
    }
    if (!isOpen) {
      setAssignError(null)
      setIsSubmitting(false)
    }
  }, [isOpen, exercises.length])

  const handleAssign = async () => {
    if (isSubmitting) return

    if (!selectedClient || !workoutName || exercises.length === 0) {
      setAssignError("Vui lòng chọn học viên, nhập tên bài tập và thêm ít nhất 1 bài tập.")
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bài tập.",
        variant: "destructive",
      })
      return
    }

    if (exercises.some((exercise) => !exercise.name.trim())) {
      setAssignError("Vui lòng chọn tên bài tập cho tất cả mục.")
      toast({
        title: "Thiếu bài tập",
        description: "Vui lòng chọn tên bài tập cho tất cả mục.",
        variant: "destructive",
      })
      return
    }
    setAssignError(null)
    setIsSubmitting(true)

    const payload = {
      userId: selectedClient,
      name: workoutName.trim(),
      date: workoutDate ? new Date(workoutDate).toISOString() : new Date().toISOString(),
      exercises: exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.rest,
        videoUrl: exercise.videoUrl,
        notes: exercise.notes,
      })),
    }

    let response: Response
    try {
      response = await fetch("/api/assigned-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      setAssignError("Không thể kết nối máy chủ, vui lòng thử lại.")
      toast({
        title: "Giao bài tập thất bại",
        description: "Không thể kết nối máy chủ, vui lòng thử lại.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!response.ok) {
      let errorMessage = "Không thể lưu bài tập, vui lòng thử lại."
      try {
        const data = await response.json()
        if (typeof data?.error === "string" && data.error.trim()) {
          errorMessage = data.error
        }
      } catch (error) {
        // Ignore JSON parse errors.
      }
      setAssignError(errorMessage)
      toast({
        title: "Giao bài tập thất bại",
        description: errorMessage,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    toast({
      title: "Giao bài tập thành công!",
      description: `Đã giao bài tập "${workoutName}" cho học viên.`,
    })

    setSelectedClient("")
    setWorkoutName("")
    setWorkoutDate("")
    setExercises([])
    setIsOpen(false)
    setIsSubmitting(false)
  }

  const canSubmit =
    selectedClient &&
    workoutName.trim().length > 0 &&
    exercises.length > 0 &&
    exercises.every((exercise) => exercise.name.trim().length > 0)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Giao bài tập mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giao bài tập cho học viên</DialogTitle>
          <DialogDescription>Tạo và giao bài tập chi tiết với video hướng dẫn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chọn học viên</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient} disabled={loadingClients}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingClients ? "Đang tải..." : "Chọn học viên"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Ngày tập</Label>
              <Input id="date" type="date" value={workoutDate} onChange={(e) => setWorkoutDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên bài tập</Label>
            <Input
              id="name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="VD: Ngày chân - Squat Focus"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Các bài tập</Label>
              <Button onClick={addExercise} variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm bài tập
              </Button>
            </div>

            {exercises.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Chưa có bài tập nào. Nhấn "Thêm bài tập" để bắt đầu.</p>
                </CardContent>
              </Card>
            )}

            {exercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                        {index + 1}
                      </span>
                      Bài tập {index + 1}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên bài tập</Label>
                    <Select
                      value={exercise.name}
                      onValueChange={(value) => {
                        const template = exerciseTemplates.find((t) => t.name === value)
                        updateExercise(exercise.id, "name", value)
                        if (template?.videoUrl) {
                          updateExercise(exercise.id, "videoUrl", template.videoUrl)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bài tập" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseTemplates.map((template) => (
                          <SelectItem key={template.name} value={template.name}>
                            <div className="flex items-center gap-2">
                              {template.name}
                              {template.videoUrl && <Video className="w-3 h-3 text-muted-foreground" />}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, "sets", Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, "reps", Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tạ (kg)</Label>
                      <Input
                        type="number"
                        value={exercise.weight || ""}
                        onChange={(e) => updateExercise(exercise.id, "weight", Number(e.target.value) || undefined)}
                        placeholder="Tùy chọn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nghỉ (s)</Label>
                      <Input
                        type="number"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(exercise.id, "rest", Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>

                  {exercise.videoUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Video className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Video hướng dẫn đã có sẵn</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Ghi chú (tùy chọn)</Label>
                    <Textarea
                      value={exercise.notes || ""}
                      onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                      placeholder="Ghi chú về kỹ thuật, tips..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleAssign} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Đang giao..." : "Giao bài tập"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Hủy
            </Button>
          </div>
          {!canSubmit ? (
            <p className="text-sm text-muted-foreground">
              Vui lòng chọn học viên, nhập tên và chọn bài tập trước khi giao.
            </p>
          ) : null}
          {assignError ? <p className="text-sm text-red-600">{assignError}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

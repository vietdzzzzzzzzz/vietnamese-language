"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Home, Dumbbell, Trash2, CheckCircle2, Clock } from "lucide-react"
import type { AssignedExercise } from "@/types/trainer"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CustomerExercisesProps {
  customerId: string
  trainerId: string
  exercises: AssignedExercise[]
  onUpdate: () => void
}

const availableExercises = [
  { id: 1, name: "Squat", category: "Legs" },
  { id: 2, name: "Bench Press", category: "Chest" },
  { id: 3, name: "Deadlift", category: "Back" },
  { id: 4, name: "Pull-ups", category: "Back" },
  { id: 5, name: "Shoulder Press", category: "Shoulders" },
  { id: 6, name: "Bicep Curls", category: "Arms" },
  { id: 7, name: "Plank", category: "Core" },
  { id: 8, name: "Lunges", category: "Legs" },
  { id: 9, name: "Push-ups", category: "Chest" },
  { id: 10, name: "Mountain Climbers", category: "Core" },
]

export function CustomerExercises({ customerId, trainerId, exercises, onUpdate }: CustomerExercisesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState("")
  const [sets, setSets] = useState("3")
  const [reps, setReps] = useState("10")
  const [restTime, setRestTime] = useState("60")
  const [category, setCategory] = useState<"gym-session" | "homework">("gym-session")
  const [notes, setNotes] = useState("")

  const handleAssignExercise = () => {
    if (!selectedExercise) return

    const exercise = availableExercises.find((ex) => ex.id.toString() === selectedExercise)
    if (!exercise) return

    const newExercise: AssignedExercise = {
      id: `${Date.now()}`,
      customerId,
      trainerId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: parseInt(sets),
      reps,
      restTime: parseInt(restTime),
      category,
      notes,
      assignedDate: new Date(),
      status: "pending",
    }

    const exercisesKey = `assigned_exercises_${customerId}`
    const existing = localStorage.getItem(exercisesKey)
    const updated = existing ? [...JSON.parse(existing), newExercise] : [newExercise]
    localStorage.setItem(exercisesKey, JSON.stringify(updated))

    // Reset form
    setSelectedExercise("")
    setSets("3")
    setReps("10")
    setRestTime("60")
    setNotes("")
    setIsDialogOpen(false)
    onUpdate()
  }

  const handleDeleteExercise = (exerciseId: string) => {
    const exercisesKey = `assigned_exercises_${customerId}`
    const updated = exercises.filter((ex) => ex.id !== exerciseId)
    localStorage.setItem(exercisesKey, JSON.stringify(updated))
    onUpdate()
  }

  const gymExercises = exercises.filter((ex) => ex.category === "gym-session")
  const homeworkExercises = exercises.filter((ex) => ex.category === "homework")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bài tập được giao</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Giao bài tập
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Giao bài tập cho học viên</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Loại bài tập</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym-session">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        <span>Tập tại phòng gym</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="homework">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>Bài tập về nhà</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chọn bài tập</Label>
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bài tập..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id.toString()}>
                        {exercise.name} - {exercise.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Số Set</Label>
                  <Input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số Reps</Label>
                  <Input value={reps} onChange={(e) => setReps(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nghỉ (giây)</Label>
                  <Input
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm ghi chú cho học viên..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAssignExercise}>Giao bài tập</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Dumbbell className="w-5 h-5" />
              Bài tập tại phòng gym ({gymExercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gymExercises.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có bài tập nào được giao
              </p>
            ) : (
              <div className="space-y-3">
                {gymExercises.map((exercise) => (
                  <div key={exercise.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{exercise.exerciseName}</p>
                          <Badge
                            variant={
                              exercise.status === "completed"
                                ? "default"
                                : exercise.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {exercise.status === "completed"
                              ? "Hoàn thành"
                              : exercise.status === "overdue"
                                ? "Quá hạn"
                                : "Chưa làm"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{exercise.sets} sets × {exercise.reps} reps</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Nghỉ {exercise.restTime}s
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">{exercise.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Giao ngày: {format(new Date(exercise.assignedDate), "dd/MM/yyyy HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExercise(exercise.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Home className="w-5 h-5" />
              Bài tập về nhà ({homeworkExercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {homeworkExercises.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có bài tập về nhà nào được giao
              </p>
            ) : (
              <div className="space-y-3">
                {homeworkExercises.map((exercise) => (
                  <div key={exercise.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{exercise.exerciseName}</p>
                          <Badge
                            variant={
                              exercise.status === "completed"
                                ? "default"
                                : exercise.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {exercise.status === "completed"
                              ? "Hoàn thành"
                              : exercise.status === "overdue"
                                ? "Quá hạn"
                                : "Chưa làm"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{exercise.sets} sets × {exercise.reps} reps</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Nghỉ {exercise.restTime}s
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">{exercise.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Giao ngày: {format(new Date(exercise.assignedDate), "dd/MM/yyyy HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExercise(exercise.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
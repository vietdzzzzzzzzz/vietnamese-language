"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  id: number
  name: string
  email: string
}

const mockClients: Client[] = [
  { id: 1, name: "Nguyễn Văn A", email: "member@gym.com" },
  { id: 2, name: "Trần Thị B", email: "member2@gym.com" },
  { id: 3, name: "Lê Văn C", email: "member3@gym.com" },
]

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
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDate, setWorkoutDate] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: 3,
      reps: 10,
      rest: 60,
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const handleAssign = () => {
    if (!selectedClient || !workoutName || exercises.length === 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bài tập",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Giao bài tập thành công!",
      description: `Đã giao bài tập "${workoutName}" cho học viên`,
    })

    // Reset form
    setSelectedClient("")
    setWorkoutName("")
    setWorkoutDate("")
    setExercises([])
    setIsOpen(false)
  }

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
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học viên" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
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
            <Button onClick={handleAssign} className="flex-1">
              Giao bài tập
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
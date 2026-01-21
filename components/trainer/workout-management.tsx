"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Copy, Edit, Trash2, Brain, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const workoutTemplates = [
  {
    id: 1,
    name: "Beginner Full Body",
    category: "Beginner",
    exercises: ["Squat", "Push-up", "Plank", "Lunges"],
    duration: 45,
    difficulty: "Dễ",
  },
  {
    id: 2,
    name: "Advanced Chest & Triceps",
    category: "Advanced",
    exercises: ["Bench Press", "Incline Press", "Dips", "Tricep Extension"],
    duration: 60,
    difficulty: "Khó",
  },
  {
    id: 3,
    name: "Intermediate Back & Biceps",
    category: "Intermediate",
    exercises: ["Deadlift", "Pull-ups", "Rows", "Bicep Curls"],
    duration: 55,
    difficulty: "Trung bình",
  },
]

export function WorkoutManagement() {
  const [templates, setTemplates] = useState(workoutTemplates)
  const [openCreate, setOpenCreate] = useState(false)

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
              <AIWorkoutCreator onClose={() => setOpenCreate(false)} />
            </DialogContent>
          </Dialog>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo bài tập mới
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{template.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge>{template.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Các bài tập:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.exercises.map((exercise) => (
                      <Badge key={exercise} variant="secondary">
                        {exercise}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Thời lượng: {template.duration} phút</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AIWorkoutCreator({ onClose }: { onClose: () => void }) {
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
              <span>Nhóm cơ: {result.targetMuscles.join(", ")}</span>
            </div>
            {result.notes && (
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <p className="text-sm leading-relaxed">{result.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {result.exercises.map((exercise: any, index: number) => (
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
            <Button className="flex-1">Lưu bài tập</Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

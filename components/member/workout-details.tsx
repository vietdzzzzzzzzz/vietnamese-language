"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle2, Play, Dumbbell, Video } from "lucide-react"
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
  completed?: boolean
}

interface Workout {
  id: number
  name: string
  exercises: Exercise[]
  duration: number
  calories: number
  date: string
}

interface WorkoutDetailsProps {
  workout: Workout
  onComplete?: () => void
}

export function WorkoutDetails({ workout, onComplete }: WorkoutDetailsProps) {
  const [exercises, setExercises] = useState(workout.exercises)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [setProgress, setSetProgress] = useState<{ [key: string]: number }>({})

  const handleCompleteSet = (exerciseId: string) => {
    const currentSets = setProgress[exerciseId] || 0
    const exercise = exercises.find((ex) => ex.id === exerciseId)

    if (exercise && currentSets < exercise.sets) {
      setSetProgress({
        ...setProgress,
        [exerciseId]: currentSets + 1,
      })

      if (currentSets + 1 === exercise.sets) {
        setExercises(exercises.map((ex) => (ex.id === exerciseId ? { ...ex, completed: true } : ex)))
        toast({
          title: "Bài tập hoàn thành!",
          description: `${exercise.name} - ${exercise.sets} sets hoàn thành 🎉`,
        })
      }
    }
  }

  const allCompleted = exercises.every((ex) => ex.completed)

  const handleCompleteWorkout = () => {
    toast({
      title: "Buổi tập hoàn thành!",
      description: `Tuyệt vời! Bạn đã hoàn thành ${workout.name} 💪`,
    })
    onComplete?.()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {workout.name}
            <Badge variant={allCompleted ? "default" : "secondary"}>
              {allCompleted ? "Hoàn thành" : `${exercises.filter((e) => e.completed).length}/${exercises.length} bài`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{workout.date}</p>
          {allCompleted && (
            <Button onClick={handleCompleteWorkout} className="w-full mb-4">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Hoàn thành buổi tập
            </Button>
          )}
        </CardContent>
      </Card>

      {exercises.map((exercise, index) => {
        const completedSets = setProgress[exercise.id] || 0
        const progress = (completedSets / exercise.sets) * 100

        return (
          <Card key={exercise.id} className={exercise.completed ? "bg-green-50 dark:bg-green-950/20" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                      {index + 1}
                    </span>
                    {exercise.name}
                    {exercise.completed && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {exercise.sets} sets x {exercise.reps} reps
                    </Badge>
                    {exercise.weight && <Badge variant="outline">{exercise.weight} kg</Badge>}
                    <Badge variant="secondary">Nghỉ {exercise.rest}s</Badge>
                  </div>
                </div>
                {exercise.videoUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentExercise(exercise)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Xem video
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{exercise.name}</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={exercise.videoUrl}
                          title={exercise.name}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {exercise.notes && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">{exercise.notes}</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercise.notes && (
                  <p className="text-sm text-muted-foreground italic">{exercise.notes}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tiến độ:</span>
                    <span className="font-medium">
                      {completedSets}/{exercise.sets} sets
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {!exercise.completed && (
                  <Button
                    onClick={() => handleCompleteSet(exercise.id)}
                    className="w-full"
                    disabled={completedSets >= exercise.sets}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Hoàn thành set {completedSets + 1}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
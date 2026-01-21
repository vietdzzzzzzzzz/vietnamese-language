export interface Exercise {
  id: number | string
  name: string
  category: string
  difficulty: "Dễ" | "Trung bình" | "Khó"
  equipment: string
  muscles: string[]
  description: string
  instructions: string[]
  tips: string[]
  videoUrl?: string
  thumbnailUrl?: string
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ExerciseFormData {
  name: string
  category: string
  difficulty: "Dễ" | "Trung bình" | "Khó"
  equipment: string
  muscles: string[]
  description: string
  instructions: string[]
  tips: string[]
  videoUrl?: string
  thumbnailUrl?: string
}

export interface WorkoutExercise {
  exercise: Exercise
  sets: number
  reps: number | string // Can be "10-12" or "10"
  restTime: number // in seconds
  notes?: string
}

export interface ExerciseHistory {
  id: string
  userId: string
  exerciseId: number | string
  exerciseName: string
  date: Date
  sets: {
    setNumber: number
    reps: number
    weight?: number
    completed: boolean
  }[]
  totalVolume?: number // weight × reps × sets
  notes?: string
}

export interface ExerciseProgress {
  exerciseId: number | string
  exerciseName: string
  history: ExerciseHistory[]
  personalBest?: {
    maxWeight: number
    maxReps: number
    maxVolume: number
    date: Date
  }
}
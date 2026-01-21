export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  age?: number
  gender?: "Nam" | "Nữ" | "Khác"
  currentWeight?: number
  targetWeight?: number
  height?: number
  joinDate: Date
  status: "active" | "inactive"
  
  // Package info
  package?: {
    name: string
    type: "session" | "duration"
    totalSessions?: number
    usedSessions: number
    remainingSessions?: number
    startDate: Date
    endDate?: Date
    status: "active" | "expired"
  }
  
  // Progress tracking
  streak?: number
  totalWorkouts?: number
  totalAttendance?: number
  
  // Health metrics
  bmi?: number
  bodyFat?: number
  muscleMass?: number
}

export interface AssignedExercise {
  id: string
  customerId: string
  trainerId: string
  exerciseName: string
  exerciseId: number | string
  sets: number
  reps: number | string
  restTime: number
  notes?: string
  assignedDate: Date
  dueDate?: Date
  status: "pending" | "completed" | "overdue"
  category: "homework" | "gym-session"
  completedDate?: Date
}

export interface DietPlan {
  id: string
  customerId: string
  trainerId: string
  date: Date
  meals: {
    type: "Sáng" | "Trưa" | "Tối" | "Phụ"
    time: string
    foods: string[]
    calories?: number
    protein?: number
    carbs?: number
    fats?: number
    notes?: string
  }[]
  totalCalories?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TrainerNote {
  id: string
  customerId: string
  trainerId: string
  content: string
  category: "health" | "progress" | "behavior" | "general"
  createdAt: Date
}

export interface ChatMessage {
  id: string
  fromId: string
  toId: string
  fromName: string
  toName: string
  message: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: "image" | "video" | "exercise" | "diet"
    url?: string
    data?: any
  }[]
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
  totalVolume?: number
  notes?: string
}

export interface CustomerProgress {
  customerId: string
  measurements: {
    date: Date
    weight?: number
    bodyFat?: number
    muscleMass?: number
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }[]
  photos: {
    date: Date
    url: string
    type: "front" | "side" | "back"
    notes?: string
  }[]
}
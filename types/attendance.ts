export interface AttendanceRecord {
  id: string
  userId: number
  checkInTime: string
  checkOutTime?: string
  date: string
  notes?: string
}

export interface UserAttendance {
  userId: number
  totalSessions: number
  currentStreak: number
  lastCheckIn?: string
  history: AttendanceRecord[]
}

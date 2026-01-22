export interface AttendanceRecord {
  id: string
  userId: string
  checkInTime: string
  checkOutTime?: string
  date: string
  notes?: string
}

export interface UserAttendance {
  userId: string
  totalSessions: number
  currentStreak: number
  lastCheckIn?: string
  history: AttendanceRecord[]
}

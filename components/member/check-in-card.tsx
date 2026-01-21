"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Flame, Calendar } from "lucide-react"
import type { AttendanceRecord, UserAttendance } from "@/types/attendance"
import { toast } from "@/hooks/use-toast"

interface CheckInCardProps {
  userId: number
  onCheckIn: (newSession: number, newStreak: number) => void
}

export function CheckInCard({ userId, onCheckIn }: CheckInCardProps) {
  const [attendance, setAttendance] = useState<UserAttendance | null>(null)
  const [isCheckedInToday, setIsCheckedInToday] = useState(false)
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)

  useEffect(() => {
    // Load attendance data from localStorage
    const savedAttendance = localStorage.getItem(`attendance_${userId}`)
    if (savedAttendance) {
      const data: UserAttendance = JSON.parse(savedAttendance)
      setAttendance(data)

      // Check if already checked in today
      const today = new Date().toISOString().split("T")[0]
      const todayCheckin = data.history.find((record) => record.date === today)
      if (todayCheckin) {
        setIsCheckedInToday(true)
        setTodayRecord(todayCheckin)
      }
    } else {
      // Initialize attendance data
      const initialAttendance: UserAttendance = {
        userId,
        totalSessions: 0,
        currentStreak: 0,
        history: [],
      }
      setAttendance(initialAttendance)
      localStorage.setItem(`attendance_${userId}`, JSON.stringify(initialAttendance))
    }
  }, [userId])

  const handleCheckIn = () => {
    if (!attendance) return

    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const checkInTime = now.toISOString()

    // Create new attendance record
    const newRecord: AttendanceRecord = {
      id: `${userId}_${Date.now()}`,
      userId,
      checkInTime,
      date: today,
    }

    // Calculate new streak
    let newStreak = attendance.currentStreak
    if (attendance.lastCheckIn) {
      const lastDate = new Date(attendance.lastCheckIn)
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    // Update attendance
    const updatedAttendance: UserAttendance = {
      ...attendance,
      totalSessions: attendance.totalSessions + 1,
      currentStreak: newStreak,
      lastCheckIn: today,
      history: [newRecord, ...attendance.history],
    }

    setAttendance(updatedAttendance)
    setIsCheckedInToday(true)
    setTodayRecord(newRecord)
    localStorage.setItem(`attendance_${userId}`, JSON.stringify(updatedAttendance))

    // Update parent component
    onCheckIn(updatedAttendance.totalSessions, newStreak)

    // Update package used sessions
    const savedPackage = localStorage.getItem("userPackage")
    if (savedPackage) {
      const userPackage = JSON.parse(savedPackage)
      if (userPackage.package.type === "session") {
        userPackage.package.usedSessions = (userPackage.package.usedSessions || 0) + 1
        localStorage.setItem("userPackage", JSON.stringify(userPackage))
      }
    }

    toast({
      title: "Điểm danh thành công!",
      description: `Buổi thứ ${updatedAttendance.totalSessions}. Streak: ${newStreak} ngày 🔥`,
    })
  }

  const handleCheckOut = () => {
    if (!todayRecord || !attendance) return

    const now = new Date()
    const checkOutTime = now.toISOString()

    // Update today's record with checkout time
    const updatedHistory = attendance.history.map((record) =>
      record.id === todayRecord.id ? { ...record, checkOutTime } : record,
    )

    const updatedAttendance = {
      ...attendance,
      history: updatedHistory,
    }

    setAttendance(updatedAttendance)
    setTodayRecord({ ...todayRecord, checkOutTime })
    localStorage.setItem(`attendance_${userId}`, JSON.stringify(updatedAttendance))

    toast({
      title: "Check-out thành công!",
      description: "Hẹn gặp lại bạn buổi tập tiếp theo!",
    })
  }

  if (!attendance) return null

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={isCheckedInToday ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Điểm danh hôm nay</CardTitle>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isCheckedInToday ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">Đã điểm danh</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Check-in: {todayRecord && formatTime(todayRecord.checkInTime)}</span>
              </div>
              {todayRecord?.checkOutTime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Check-out: {formatTime(todayRecord.checkOutTime)}</span>
                </div>
              )}
            </div>
            {!todayRecord?.checkOutTime && (
              <Button onClick={handleCheckOut} variant="outline" size="sm" className="w-full bg-transparent">
                Check-out
              </Button>
            )}
            <div className="flex gap-2 pt-2 border-t">
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                {attendance.currentStreak} ngày
              </Badge>
              <Badge variant="outline">Tổng: {attendance.totalSessions} buổi</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Chưa điểm danh hôm nay</div>
            <Button onClick={handleCheckIn} className="w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Điểm danh ngay
            </Button>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                {attendance.currentStreak} ngày
              </Badge>
              <Badge variant="outline">Tổng: {attendance.totalSessions} buổi</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Flame, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type AttendanceRecord = {
  id: string
  checkInTime: string
  checkOutTime?: string
  duration?: number
}

interface CheckInCardProps {
  userId: string
  onCheckIn: (newSession: number, newStreak: number) => void
}

export function CheckInCard({ userId, onCheckIn }: CheckInCardProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isCheckedInToday, setIsCheckedInToday] = useState(false)
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)

  useEffect(() => {
    loadAttendance()
  }, [userId])

  const loadAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?userId=${userId}`)
      if (!response.ok) return
      const data = await response.json()
      const attendanceRecords = Array.isArray(data?.attendances) ? data.attendances : []
      setRecords(attendanceRecords)
      const total = attendanceRecords.length
      setTotalSessions(total)

      const { streak, checkedInToday, today } = calculateStreak(attendanceRecords)
      setCurrentStreak(streak)
      setIsCheckedInToday(checkedInToday)
      setTodayRecord(today)
      return { total, streak }
    } catch (error) {
      // Ignore load errors for now
    }
    return { total: 0, streak: 0 }
  }

  const calculateStreak = (attendanceRecords: AttendanceRecord[]) => {
    if (attendanceRecords.length === 0) {
      return { streak: 0, checkedInToday: false, today: null as AttendanceRecord | null }
    }

    const sorted = [...attendanceRecords].sort(
      (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime(),
    )
    const todayDate = new Date().toISOString().split("T")[0]
    const uniqueDates = Array.from(
      new Set(sorted.map((record) => record.checkInTime.split("T")[0])),
    )

    let streak = 0
    let currentDate = todayDate
    for (const date of uniqueDates) {
      if (date === currentDate) {
        streak += 1
        const prev = new Date(currentDate)
        prev.setDate(prev.getDate() - 1)
        currentDate = prev.toISOString().split("T")[0]
      } else {
        break
      }
    }

    const checkedInToday = uniqueDates[0] === todayDate
    const today = checkedInToday ? sorted.find((record) => record.checkInTime.startsWith(todayDate)) || null : null

    return { streak, checkedInToday, today }
  }

  const handleCheckIn = async () => {
    const now = new Date()
    const checkInTime = now.toISOString()

    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, checkInTime }),
    })

    if (!response.ok) {
      toast({
        title: "Điểm danh thất bại",
        description: "Không thể lưu điểm danh. Vui lòng thử lại.",
      })
      return
    }

    const updated = await loadAttendance()
    onCheckIn(updated.total, updated.streak)

    toast({
      title: "Điểm danh thành công!",
      description: `Buổi thứ ${updated.total}. Streak: ${updated.streak} ngày.`,
    })
  }

  const handleCheckOut = async () => {
    if (!todayRecord) return

    const now = new Date().toISOString()
    const response = await fetch("/api/attendance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceId: todayRecord.id, checkOutTime: now }),
    })

    if (!response.ok) {
      toast({
        title: "Check-out thất bại",
        description: "Không thể lưu check-out. Vui lòng thử lại.",
      })
      return
    }

    await loadAttendance()
    toast({
      title: "Check-out thành công!",
      description: "Hẹn gặp lại bạn buổi tập tiếp theo!",
    })
  }

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
                {currentStreak} ngày
              </Badge>
              <Badge variant="outline">Tổng: {totalSessions} buổi</Badge>
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
                {currentStreak} ngày
              </Badge>
              <Badge variant="outline">Tổng: {totalSessions} buổi</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

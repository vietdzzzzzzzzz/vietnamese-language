"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Calendar } from "lucide-react"
import type { UserAttendance } from "@/types/attendance"

interface AttendanceHistoryProps {
  userId: number
}

export function AttendanceHistory({ userId }: AttendanceHistoryProps) {
  const [attendance, setAttendance] = useState<UserAttendance | null>(null)

  useEffect(() => {
    const savedAttendance = localStorage.getItem(`attendance_${userId}`)
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance))
    }
  }, [userId])

  if (!attendance || attendance.history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử điểm danh</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Chưa có lịch sử điểm danh. Bắt đầu điểm danh để theo dõi tiến độ!
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return null
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
    return minutes
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử điểm danh</CardTitle>
        <p className="text-sm text-muted-foreground">{attendance.history.length} buổi tập đã hoàn thành</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {attendance.history.map((record, index) => {
              const duration = calculateDuration(record.checkInTime, record.checkOutTime)
              return (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">#{attendance.history.length - index}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(record.date)}</span>
                      {index === 0 && <Badge variant="outline">Mới nhất</Badge>}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Check-in: {formatTime(record.checkInTime)}</span>
                      </div>
                      {record.checkOutTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Check-out: {formatTime(record.checkOutTime)}</span>
                        </div>
                      )}
                      {duration && (
                        <Badge variant="secondary" className="mt-1">
                          Thời gian: {duration} phút
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

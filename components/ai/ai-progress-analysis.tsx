"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Loader2, Heart, TriangleAlert } from "lucide-react"

interface AIProgressAnalysisProps {
  userId?: string
  currentWeight?: number
  targetWeight?: number
}

type AnalysisResponse = {
  summary: string
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  motivationalMessage?: string
}

export function AIProgressAnalysis({ userId, currentWeight, targetWeight }: AIProgressAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = async () => {
    if (!userId) {
      return {
        totalWorkouts: 0,
        startWeight: currentWeight ?? 0,
        currentWeight: currentWeight ?? 0,
        targetWeight: targetWeight ?? 0,
        attendanceCount: 0,
        durationWeeks: 4,
      }
    }

    const [progressRes, attendanceRes] = await Promise.all([
      fetch(`/api/progress?userId=${userId}`),
      fetch(`/api/attendance?userId=${userId}`),
    ])

    const progressData = progressRes.ok ? await progressRes.json() : { progress: [] }
    const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { attendances: [] }

    const progress = Array.isArray(progressData?.progress) ? progressData.progress : []
    const attendances = Array.isArray(attendanceData?.attendances) ? attendanceData.attendances : []

    const totalWorkouts = progress.length
    const sortedProgress = [...progress].sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    const startWeightFromProgress =
      sortedProgress.length > 0 ? Number(sortedProgress[0]?.weight || 0) : undefined
    const currentWeightFromProgress =
      sortedProgress.length > 0 ? Number(sortedProgress[sortedProgress.length - 1]?.weight || 0) : undefined

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const attendanceCount = attendances.filter((record: any) => {
      const checkIn = new Date(record.checkInTime)
      return checkIn >= thirtyDaysAgo
    }).length

    const durationWeeks =
      sortedProgress.length > 1
        ? Math.max(
            1,
            Math.round(
              (new Date(sortedProgress[sortedProgress.length - 1]?.date).getTime() -
                new Date(sortedProgress[0]?.date).getTime()) /
                (7 * 24 * 60 * 60 * 1000),
            ),
          )
        : 4

    return {
      totalWorkouts,
      startWeight: startWeightFromProgress ?? currentWeight ?? 0,
      currentWeight: currentWeightFromProgress ?? currentWeight ?? 0,
      targetWeight: targetWeight ?? 0,
      attendanceCount,
      durationWeeks,
    }
  }

  const generateAnalysis = async () => {
    setLoading(true)
    setError(null)
    try {
      const userData = await loadMetrics()
      const response = await fetch("/api/ai-progress-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Không thể tạo phân tích AI.")
      }

      const data = await response.json()
      setAnalysis(data.analysis as AnalysisResponse)
    } catch (err: any) {
      setError(err?.message || "Không thể tạo phân tích AI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Phân tích tiến độ
            </CardTitle>
            <Button onClick={generateAnalysis} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Tạo phân tích mới
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : !analysis ? (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nhấn nút để AI phân tích tiến độ tập luyện của bạn</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Tổng quan</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Điểm mạnh
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Cần cải thiện
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Đề xuất
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.motivationalMessage ? (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm leading-relaxed font-medium">{analysis.motivationalMessage}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

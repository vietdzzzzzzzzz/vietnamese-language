"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Loader2, Heart } from "lucide-react"

export function AIProgressAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-progress-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            totalWorkouts: 24,
            startWeight: 75,
            currentWeight: 72,
            targetWeight: 68,
            attendance: 85,
            duration: "4 tuần",
            startSquat: 80,
            currentSquat: 97,
          },
        }),
      })
      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("Error generating analysis:", error)
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
          {!analysis ? (
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
                  {analysis.strengths.map((item: string, index: number) => (
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
                  {analysis.improvements.map((item: string, index: number) => (
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
                  {analysis.recommendations.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.motivationalMessage && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm leading-relaxed font-medium">{analysis.motivationalMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

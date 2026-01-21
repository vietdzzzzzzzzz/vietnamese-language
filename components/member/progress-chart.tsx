"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const weightData = [
  { date: "T1", weight: 75 },
  { date: "T2", weight: 74.5 },
  { date: "T3", weight: 74 },
  { date: "T4", weight: 73.5 },
  { date: "T5", weight: 73 },
  { date: "T6", weight: 72.5 },
  { date: "T7", weight: 72 },
]

const strengthData = [
  { date: "T1", squat: 80, bench: 60, deadlift: 100 },
  { date: "T2", squat: 85, bench: 62, deadlift: 105 },
  { date: "T3", squat: 87, bench: 65, deadlift: 107 },
  { date: "T4", squat: 90, bench: 67, deadlift: 110 },
  { date: "T5", squat: 92, bench: 70, deadlift: 115 },
  { date: "T6", squat: 95, bench: 72, deadlift: 117 },
  { date: "T7", squat: 97, bench: 75, deadlift: 120 },
]

export function ProgressChart() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ cân nặng</CardTitle>
          <CardDescription>Theo dõi sự thay đổi cân nặng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[70, 76]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Cân nặng (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tiến độ sức mạnh</CardTitle>
          <CardDescription>Theo dõi trọng lượng nâng được (kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={strengthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="squat" stroke="#8884d8" strokeWidth={2} name="Squat" />
              <Line type="monotone" dataKey="bench" stroke="#82ca9d" strokeWidth={2} name="Bench Press" />
              <Line type="monotone" dataKey="deadlift" stroke="#ffc658" strokeWidth={2} name="Deadlift" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

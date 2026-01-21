"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const monthlyRevenue = [
  { month: "T7", revenue: 95, members: 210 },
  { month: "T8", revenue: 102, members: 218 },
  { month: "T9", revenue: 108, members: 225 },
  { month: "T10", revenue: 115, members: 232 },
  { month: "T11", revenue: 128, members: 239 },
  { month: "T12", revenue: 135, members: 242 },
  { month: "T1", revenue: 142, members: 247 },
]

const packageDistribution = [
  { name: "Basic", value: 120, revenue: 36 },
  { name: "Premium", value: 85, revenue: 68 },
  { name: "VIP", value: 42, revenue: 50 },
]

export function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Phân tích doanh thu</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {packageDistribution.map((pkg) => (
          <Card key={pkg.name}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>Gói tập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold">{pkg.value}</p>
                  <p className="text-sm text-muted-foreground">Thành viên</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{pkg.revenue}M VNĐ</p>
                  <p className="text-sm text-muted-foreground">Doanh thu/tháng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
          <CardDescription>Biểu đồ doanh thu và số lượng thành viên</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Doanh thu (triệu VNĐ)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="members"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Số thành viên"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>So sánh gói tập</CardTitle>
          <CardDescription>Số lượng thành viên theo từng gói</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={packageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" name="Số thành viên" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

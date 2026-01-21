"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Weight, Activity } from "lucide-react"
import type { CustomerProfile } from "@/types/trainer"

interface CustomerProgressProps {
  customerId: string
  customer: CustomerProfile
}

export function CustomerProgress({ customerId, customer }: CustomerProgressProps) {
  const getWeightChange = () => {
    if (customer.currentWeight && customer.targetWeight) {
      const change = customer.currentWeight - customer.targetWeight
      return {
        value: Math.abs(change).toFixed(1),
        isPositive: change > 0,
        percentage: customer.targetWeight ? ((change / customer.targetWeight) * 100).toFixed(1) : 0,
      }
    }
    return null
  }

  const weightChange = getWeightChange()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Tiến độ cân nặng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cân nặng hiện tại</p>
                <p className="text-2xl font-bold">{customer.currentWeight || "N/A"} kg</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Mục tiêu</p>
                <p className="text-2xl font-bold">{customer.targetWeight || "N/A"} kg</p>
              </div>
            </div>
            {weightChange && (
              <div className="flex items-center gap-2">
                {weightChange.isPositive ? (
                  <Badge variant="destructive" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{weightChange.value} kg
                  </Badge>
                ) : (
                  <Badge className="gap-1">
                    <TrendingDown className="w-3 h-3" />
                    -{weightChange.value} kg
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">so với mục tiêu</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng buổi tập</span>
                <span className="font-medium">{customer.totalWorkouts || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Số lần điểm danh</span>
                <span className="font-medium">{customer.totalAttendance || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Streak hiện tại</span>
                <Badge>{customer.streak || 0} ngày</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ghi chú về tiến độ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tính năng theo dõi chi tiết đang được phát triển...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
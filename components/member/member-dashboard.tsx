"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Dumbbell, MessageSquare, Target, LogOut, Brain, Edit, Package, Flame, History, Apple } from "lucide-react"
import { WorkoutList } from "./workout-list"
import { ProgressChart } from "./progress-chart"
import { AIChatInterface } from "@/components/ai/ai-chat-interface"
import { AIProgressAnalysis } from "@/components/ai/ai-progress-analysis"
import { PackageSelection } from "./package-selection"
import { CheckInCard } from "./check-in-card"
import { AttendanceHistory } from "./attendance-history"
import { NutritionTracker } from "./nutrition-tracker"
import { NotificationCenter } from "@/components/shared/notification-center"
import type { Package as PackageType } from "@/types/package"

export function MemberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [targetWeight, setTargetWeight] = useState(68)
  const [currentWeight, setCurrentWeight] = useState(72)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isCurrentWeightDialogOpen, setIsCurrentWeightDialogOpen] = useState(false)
  const [tempTargetWeight, setTempTargetWeight] = useState(68)
  const [tempCurrentWeight, setTempCurrentWeight] = useState(72)
  const [currentPackage, setCurrentPackage] = useState<PackageType | null>(null)
  const [usedSessions, setUsedSessions] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    const savedTarget = localStorage.getItem("targetWeight")
    const savedCurrent = localStorage.getItem("currentWeight")
    if (savedTarget) setTargetWeight(Number(savedTarget))
    if (savedCurrent) setCurrentWeight(Number(savedCurrent))

    const savedPackage = localStorage.getItem("userPackage")
    if (savedPackage) {
      const userPackage = JSON.parse(savedPackage)
      setCurrentPackage(userPackage.package)
      if (userPackage.package.usedSessions) {
        setUsedSessions(userPackage.package.usedSessions)
      }
    }

    const savedAttendance = localStorage.getItem(`attendance_${parsedUser.id}`)
    if (savedAttendance) {
      const attendance = JSON.parse(savedAttendance)
      setCurrentStreak(attendance.currentStreak || 0)
    }
  }, [router])

  const handleSaveGoal = () => {
    setTargetWeight(tempTargetWeight)
    localStorage.setItem("targetWeight", tempTargetWeight.toString())
    setIsGoalDialogOpen(false)
  }

  const handleSaveCurrentWeight = () => {
    setCurrentWeight(tempCurrentWeight)
    localStorage.setItem("currentWeight", tempCurrentWeight.toString())
    setIsCurrentWeightDialogOpen(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/")
  }

  const handlePackageSelect = (pkg: PackageType) => {
    setCurrentPackage(pkg)
    setUsedSessions(0)
  }

  const handleCheckIn = (newTotalSessions: number, newStreak: number) => {
    setCurrentStreak(newStreak)
    if (currentPackage?.type === "session") {
      setUsedSessions(newTotalSessions)
    }
  }

  if (!user) return null

  const weightDiff = currentWeight - targetWeight
  const totalWeightToLose = 75 - targetWeight
  const progress = Math.max(0, Math.min(100, ((totalWeightToLose - weightDiff) / totalWeightToLose) * 100))

  const remainingSessions =
    currentPackage?.type === "session" ? (currentPackage.totalSessions || 0) - usedSessions : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Dumbbell className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">GYMORA Member</h1>
                <p className="text-sm text-muted-foreground">Chào {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Avatar>
                <AvatarFallback>{user.name?.[0] || "M"}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <CheckInCard userId={user.id} onCheckIn={handleCheckIn} />
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gói tập hiện tại</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {currentPackage ? (
                <>
                  <div className="text-lg font-bold">{currentPackage.name}</div>
                  {currentPackage.type === "session" && (
                    <p className="text-xs text-muted-foreground">
                      Còn {remainingSessions}/{currentPackage.totalSessions} buổi
                    </p>
                  )}
                  {currentPackage.type === "duration" && (
                    <p className="text-xs text-muted-foreground">Unlimited {currentPackage.durationMonths} tháng</p>
                  )}
                  <Badge className="mt-2" variant="outline">
                    {currentPackage.type === "session" ? "Theo buổi" : "Theo thời gian"}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">Chưa có gói</div>
                  <p className="text-xs text-muted-foreground">Đăng ký ngay</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Streak hiện tại</CardTitle>
              <Flame className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {currentStreak}
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                {currentStreak > 0 ? "Tuyệt vời! Giữ vững phong độ" : "Bắt đầu điểm danh ngay"}
              </p>
            </CardContent>
          </Card>

          <Dialog open={isCurrentWeightDialogOpen} onOpenChange={setIsCurrentWeightDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Cân nặng hiện tại</CardTitle>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <Edit className="w-3 h-3 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentWeight} kg</div>
                  <p className="text-xs text-green-600">-3 kg so với tháng trước</p>
                  <p className="text-xs text-muted-foreground mt-1">Nhấn để cập nhật</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật cân nặng hiện tại</DialogTitle>
                <DialogDescription>
                  Cập nhật cân nặng hiện tại của bạn để theo dõi tiến độ chính xác hơn.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Cân nặng hiện tại (kg)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={tempCurrentWeight}
                    onChange={(e) => setTempCurrentWeight(Number(e.target.value))}
                    placeholder="Nhập cân nặng hiện tại"
                  />
                  <p className="text-sm text-muted-foreground">Mục tiêu: {targetWeight} kg</p>
                  {tempCurrentWeight > targetWeight && (
                    <p className="text-sm text-amber-600">
                      Còn {(tempCurrentWeight - targetWeight).toFixed(1)} kg để đạt mục tiêu
                    </p>
                  )}
                  {tempCurrentWeight <= targetWeight && (
                    <p className="text-sm text-green-600">Chúc mừng! Bạn đã đạt mục tiêu!</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCurrentWeightDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSaveCurrentWeight}>Lưu cân nặng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Mục tiêu</CardTitle>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <Edit className="w-3 h-3 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{targetWeight} kg</div>
                  <Progress value={progress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Nhấn để chỉnh sửa</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa mục tiêu cân nặng</DialogTitle>
                <DialogDescription>Đặt cân nặng mục tiêu phù hợp với kế hoạch tập luyện của bạn.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="target">Cân nặng mục tiêu (kg)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={tempTargetWeight}
                    onChange={(e) => setTempTargetWeight(Number(e.target.value))}
                    placeholder="Nhập cân nặng mục tiêu"
                  />
                  <p className="text-sm text-muted-foreground">Cân nặng hiện tại: {currentWeight} kg</p>
                  {tempTargetWeight < currentWeight && (
                    <p className="text-sm text-green-600">
                      Còn {(currentWeight - tempTargetWeight).toFixed(1)} kg để đạt mục tiêu
                    </p>
                  )}
                  {tempTargetWeight > currentWeight && (
                    <p className="text-sm text-blue-600">
                      Cần tăng {(tempTargetWeight - currentWeight).toFixed(1)} kg để đạt mục tiêu
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSaveGoal}>Lưu mục tiêu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="workouts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="workouts">
              <Dumbbell className="w-4 h-4 mr-2" />
              Bài tập
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tiến độ
            </TabsTrigger>
            <TabsTrigger value="nutrition">
              <Apple className="w-4 h-4 mr-2" />
              Dinh dưỡng
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Package className="w-4 h-4 mr-2" />
              Gói tập
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Lịch sử
            </TabsTrigger>
            <TabsTrigger value="ai-analysis">
              <Brain className="w-4 h-4 mr-2" />
              AI
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts">
            <WorkoutList />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressChart />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionTracker />
          </TabsContent>

          <TabsContent value="packages">
            <PackageSelection currentPackage={currentPackage || undefined} onSelectPackage={handlePackageSelect} />
          </TabsContent>

          <TabsContent value="history">
            <AttendanceHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="ai-analysis">
            <AIProgressAnalysis />
          </TabsContent>

          <TabsContent value="chat">
            <AIChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

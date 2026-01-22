"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  TrendingUp,
  Dumbbell,
  MessageSquare,
  Target,
  LogOut,
  Brain,
  Edit,
  Package,
  Flame,
  History,
  Apple,
  Ruler,
  Image as ImageIcon,
} from "lucide-react"
import { WorkoutList } from "./workout-list"
import { ProgressChart } from "./progress-chart"
import { AIChatInterface } from "@/components/ai/ai-chat-interface"
import { AIProgressAnalysis } from "@/components/ai/ai-progress-analysis"
import { PackageSelection } from "./package-selection"
import { CheckInCard } from "./check-in-card"
import { AttendanceHistory } from "./attendance-history"
import { NutritionTracker } from "./nutrition-tracker"
import { TrainerChat } from "./trainer-chat"
import { NotificationCenter } from "@/components/shared/notification-center"
import { SpringGifs } from "@/components/shared/spring-gifs"
import type { Package as PackageType } from "@/types/package"

export function MemberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [targetWeight, setTargetWeight] = useState(0)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [avatar, setAvatar] = useState<string>("")
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isCurrentWeightDialogOpen, setIsCurrentWeightDialogOpen] = useState(false)
  const [isHeightDialogOpen, setIsHeightDialogOpen] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [tempTargetWeight, setTempTargetWeight] = useState(0)
  const [tempCurrentWeight, setTempCurrentWeight] = useState(0)
  const [tempHeight, setTempHeight] = useState(0)
  const [tempAvatar, setTempAvatar] = useState("")
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<PackageType | null>(null)
  const [usedSessions, setUsedSessions] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const data = await response.json()
        if (isMounted) {
          setUser(data.user)
          setCurrentWeight(Number(data.user.currentWeight || 0))
          setTargetWeight(Number(data.user.targetWeight || 0))
          setHeight(Number(data.user.height || 0))
          setAvatar(data.user.avatar || "")
          setTempCurrentWeight(Number(data.user.currentWeight || 0))
          setTempTargetWeight(Number(data.user.targetWeight || 0))
          setTempHeight(Number(data.user.height || 0))
          setTempAvatar(data.user.avatar || "")
        }
        await Promise.all([loadAttendance(data.user.id), loadPackage(data.user.id)])
      } catch (error) {
        router.push("/login")
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [router])

  const loadAttendance = async (userId: string) => {
    try {
      const response = await fetch(`/api/attendance?userId=${userId}`)
      if (!response.ok) return
      const data = await response.json()
      const records = Array.isArray(data?.attendances) ? data.attendances : []
      setCurrentStreak(calculateStreak(records))
    } catch (error) {
      // Ignore load errors for now
    }
  }

  const calculateStreak = (records: { checkInTime: string }[]) => {
    if (records.length === 0) return 0

    const sorted = [...records].sort(
      (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime(),
    )
    const uniqueDates = Array.from(new Set(sorted.map((record) => record.checkInTime.split("T")[0])))
    const todayDate = new Date().toISOString().split("T")[0]

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

    return streak
  }

  const loadPackage = async (userId: string) => {
    try {
      const response = await fetch(`/api/packages?userId=${userId}`)
      if (!response.ok) return
      const data = await response.json()
      if (data?.package) {
        const pkg = data.package
        setCurrentPackage({
          id: pkg.packageId,
          name: pkg.packageName,
          type: pkg.packageType,
          totalSessions: pkg.totalSessions,
          durationMonths: pkg.packageType === "duration" ? pkg.durationMonths : undefined,
          price: pkg.price || 0,
          description: pkg.description || "",
          features: pkg.features || [],
        })
        setUsedSessions(pkg.usedSessions || 0)
        return
      }
    } catch (error) {
      // Ignore load errors for now
    }

    const savedPackage = localStorage.getItem("userPackage")
    if (savedPackage) {
      const userPackage = JSON.parse(savedPackage)
      setCurrentPackage(userPackage.package)
      if (userPackage.package.usedSessions) {
        setUsedSessions(userPackage.package.usedSessions)
      }
    }
  }

  const handleSaveGoal = async () => {
    setTargetWeight(tempTargetWeight)
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetWeight: tempTargetWeight }),
    })
    setIsGoalDialogOpen(false)
  }

  const handleSaveCurrentWeight = async () => {
    setCurrentWeight(tempCurrentWeight)
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentWeight: tempCurrentWeight }),
    })
    setIsCurrentWeightDialogOpen(false)
  }

  const handleSaveHeight = async () => {
    setHeight(tempHeight)
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ height: tempHeight }),
    })
    setIsHeightDialogOpen(false)
  }

  const handleSaveAvatar = async () => {
    setAvatar(tempAvatar.trim())
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: tempAvatar.trim() }),
    })
    setIsAvatarDialogOpen(false)
  }

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setAvatarError("Vui lòng chọn file ảnh.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.")
      return
    }

    setAvatarError(null)
    setIsAvatarUploading(true)
    try {
      const dataUrl = await resizeImageToDataUrl(file, 256)
      setTempAvatar(dataUrl)
    } catch (error) {
      setAvatarError("Không thể xử lý ảnh. Vui lòng thử ảnh khác.")
    } finally {
      setIsAvatarUploading(false)
    }
  }

  const resizeImageToDataUrl = (file: File, maxSize: number) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
          const width = Math.round(img.width * scale)
          const height = Math.round(img.height * scale)
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Canvas not supported"))
            return
          }
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/jpeg", 0.85))
        }
        img.onerror = () => reject(new Error("Invalid image"))
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error("File read error"))
      reader.readAsDataURL(file)
    })
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
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
  const totalWeightToLose = targetWeight ? Math.abs(75 - targetWeight) : 0
  const progress = totalWeightToLose
    ? Math.max(0, Math.min(100, ((totalWeightToLose - weightDiff) / totalWeightToLose) * 100))
    : 0
  const bmi = height ? (currentWeight / ((height / 100) * (height / 100))).toFixed(1) : "N/A"

  const remainingSessions =
    currentPackage?.type === "session" ? (currentPackage.totalSessions || 0) - usedSessions : null

  return (
    <div className="min-h-screen bg-background">
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
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-auto p-0">
                    <Avatar>
                      {avatar ? <AvatarImage src={avatar} alt={user.name} /> : null}
                      <AvatarFallback>{user.name?.[0] || "M"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đổi avatar</DialogTitle>
                    <DialogDescription>Dán link ảnh để cập nhật avatar.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Link ảnh</Label>
                      <Input
                        id="avatar"
                        type="url"
                        value={tempAvatar}
                        onChange={(e) => setTempAvatar(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="avatar-file">Hoặc upload từ máy</Label>
                      <Input
                        id="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                      />
                      {avatarError ? <p className="text-sm text-red-600">{avatarError}</p> : null}
                      {isAvatarUploading ? (
                        <p className="text-sm text-muted-foreground">Đang xử lý ảnh...</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        {tempAvatar ? <AvatarImage src={tempAvatar} alt={user.name} /> : null}
                        <AvatarFallback>
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">Xem trước avatar</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveAvatar}>Lưu avatar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 mx-auto">
        <SpringGifs />

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
                  <div className="text-2xl font-bold">{currentWeight ? `${currentWeight} kg` : "N/A"}</div>
                  <p className="text-xs text-muted-foreground">BMI: {bmi}</p>
                  <p className="text-xs text-muted-foreground mt-1">Nhấn để cập nhật</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật cân nặng hiện tại</DialogTitle>
                <DialogDescription>Cập nhật cân nặng hiện tại để theo dõi tiến độ chính xác hơn.</DialogDescription>
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
                  <p className="text-sm text-muted-foreground">Mục tiêu: {targetWeight || "N/A"} kg</p>
                  {targetWeight > 0 && tempCurrentWeight > targetWeight && (
                    <p className="text-sm text-amber-600">
                      Còn {(tempCurrentWeight - targetWeight).toFixed(1)} kg để đạt mục tiêu
                    </p>
                  )}
                  {targetWeight > 0 && tempCurrentWeight <= targetWeight && (
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
                  <div className="text-2xl font-bold">{targetWeight ? `${targetWeight} kg` : "N/A"}</div>
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
                  <p className="text-sm text-muted-foreground">Cân nặng hiện tại: {currentWeight || "N/A"} kg</p>
                  {currentWeight > 0 && tempTargetWeight < currentWeight && (
                    <p className="text-sm text-green-600">
                      Còn {(currentWeight - tempTargetWeight).toFixed(1)} kg để đạt mục tiêu
                    </p>
                  )}
                  {currentWeight > 0 && tempTargetWeight > currentWeight && (
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

          <Dialog open={isHeightDialogOpen} onOpenChange={setIsHeightDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Chiều cao</CardTitle>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <Edit className="w-3 h-3 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{height ? `${height} cm` : "N/A"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Nhấn để cập nhật</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật chiều cao</DialogTitle>
                <DialogDescription>Nhập chiều cao để tính BMI chính xác.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Chiều cao (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={tempHeight}
                    onChange={(e) => setTempHeight(Number(e.target.value))}
                    placeholder="Nhập chiều cao"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsHeightDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSaveHeight}>Lưu chiều cao</Button>
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
            <WorkoutList userId={user.id} currentWeight={currentWeight} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressChart />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionTracker />
          </TabsContent>

          <TabsContent value="packages">
            <PackageSelection
              currentPackage={currentPackage || undefined}
              onSelectPackage={handlePackageSelect}
              userId={user.id}
            />
          </TabsContent>

          <TabsContent value="history">
            <AttendanceHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="ai-analysis">
            <AIProgressAnalysis />
          </TabsContent>

          <TabsContent value="chat">
            <Tabs defaultValue="trainer" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trainer">Huấn luyện viên</TabsTrigger>
                <TabsTrigger value="ai">AI Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="trainer">
                <TrainerChat />
              </TabsContent>
              <TabsContent value="ai">
                <AIChatInterface />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

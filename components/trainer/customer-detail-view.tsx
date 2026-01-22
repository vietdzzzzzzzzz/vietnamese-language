"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  TrendingUp,
  Dumbbell,
  Apple,
  MessageSquare,
  Activity,
  History,
  FileText,
  Target,
  Weight,
  CheckCircle,
} from "lucide-react"
import type { CustomerProfile, AssignedExercise, DietPlan } from "@/types/trainer"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CustomerExercises } from "./customer-exercises"
import { CustomerDietPlan } from "./customer-diet-plan"
import { CustomerChat } from "./customer-chat"
import { CustomerProgress } from "./customer-progress"

interface CustomerDetailViewProps {
  customer: CustomerProfile
  trainerId: string
  trainerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab?: "info" | "exercises" | "diet" | "progress" | "history" | "chat"
}

type AttendanceRecord = {
  id: string
  checkInTime: string
  checkOutTime?: string
  duration?: number
  workoutType?: string
  notes?: string
}

type ProgressRecord = {
  id: string
  date: string
  weight?: number
  exercisesCount: number
  notes?: string
}

export function CustomerDetailView({
  customer,
  trainerId,
  trainerName,
  open,
  onOpenChange,
  initialTab = "info",
}: CustomerDetailViewProps) {
  const [exercises, setExercises] = useState<AssignedExercise[]>([])
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [memberDetails, setMemberDetails] = useState<CustomerProfile | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    "info" | "exercises" | "diet" | "progress" | "history" | "chat"
  >(initialTab)

  useEffect(() => {
    if (open && customer) {
      setActiveTab(initialTab)
      loadLocalData()
      loadMemberDetails()
    }
  }, [open, customer, initialTab])

  const loadLocalData = () => {
    const exercisesKey = `assigned_exercises_${customer.id}`
    const savedExercises = localStorage.getItem(exercisesKey)
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    }

    const dietKey = `diet_plans_${customer.id}`
    const savedDiet = localStorage.getItem(dietKey)
    if (savedDiet) {
      setDietPlans(JSON.parse(savedDiet))
    }
  }

  const loadMemberDetails = async () => {
    setLoadingDetails(true)
    setDetailsError(null)
    try {
      const response = await fetch(`/api/trainer/member-details?userId=${customer.id}`)
      if (!response.ok) {
        setDetailsError("Không thể tải hồ sơ học viên.")
        return
      }

      const data = await response.json()
      const user = data?.user
      if (!user) {
        setDetailsError("Không thể tải hồ sơ học viên.")
        return
      }

      const packageData = data?.package
      const streakFromAttendance = calculateStreakFromAttendance(
        Array.isArray(data?.attendance) ? data.attendance : [],
      )

      const parsedProfile: CustomerProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        height: user.height,
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight,
        joinDate: new Date(user.createdAt),
        status: "active",
        package: packageData
          ? {
              name: packageData.name,
              type: packageData.type,
              totalSessions: packageData.totalSessions,
              usedSessions: packageData.usedSessions || 0,
              startDate: new Date(packageData.startDate),
              endDate: packageData.endDate ? new Date(packageData.endDate) : undefined,
              status: packageData.status === "active" ? "active" : "expired",
            }
          : undefined,
        streak: streakFromAttendance || user.streak,
        totalWorkouts: Array.isArray(data?.progress) ? data.progress.length : 0,
        totalAttendance: Array.isArray(data?.attendance) ? data.attendance.length : 0,
      }

      setMemberDetails(parsedProfile)
      setAttendance(Array.isArray(data?.attendance) ? data.attendance : [])
      setProgress(Array.isArray(data?.progress) ? data.progress : [])
    } catch (error) {
      setDetailsError("Không thể tải hồ sơ học viên.")
    } finally {
      setLoadingDetails(false)
    }
  }

  const calculateStreakFromAttendance = (records: AttendanceRecord[]) => {
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

  const activeCustomer = memberDetails ?? customer
  const attendanceCount = attendance.length
  const sessionTotal = activeCustomer.package?.totalSessions
  const sessionUsed =
    activeCustomer.package?.usedSessions && activeCustomer.package.usedSessions > 0
      ? activeCustomer.package.usedSessions
      : attendanceCount

  const getBMI = () => {
    if (activeCustomer.currentWeight && activeCustomer.height) {
      const heightInMeters = activeCustomer.height / 100
      return (activeCustomer.currentWeight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return "N/A"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              {activeCustomer.avatar ? <AvatarImage src={activeCustomer.avatar} alt={activeCustomer.name} /> : null}
              <AvatarFallback className="text-lg">{activeCustomer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">{activeCustomer.name}</h2>
              <p className="text-sm text-muted-foreground font-normal">Hồ sơ học viên</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {detailsError && <p className="text-sm text-red-600">{detailsError}</p>}
          {loadingDetails && <p className="text-sm text-muted-foreground">Đang tải hồ sơ học viên...</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Cân nặng hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">{activeCustomer.currentWeight || "N/A"} kg</div>
                <p className="text-xs text-muted-foreground">Mục tiêu: {activeCustomer.targetWeight || "N/A"} kg</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  BMI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">{getBMI()}</div>
                <p className="text-xs text-muted-foreground">Chỉ số cơ thể</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Buổi tập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {attendanceCount}
                  {sessionTotal ? `/${sessionTotal}` : ""}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeCustomer.package?.type === "session" ? "Theo buổi" : "Unlimited"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">{activeCustomer.streak || 0} ngày</div>
                <p className="text-xs text-muted-foreground">Chuỗi tập luyện</p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "info" | "exercises" | "diet" | "progress" | "history" | "chat")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="exercises">Bài tập</TabsTrigger>
              <TabsTrigger value="diet">Chế độ ăn</TabsTrigger>
              <TabsTrigger value="progress">Tiến độ</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{activeCustomer.email}</span>
                      </div>
                      {activeCustomer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">SĐT:</span>
                          <span className="font-medium">{activeCustomer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Ngày tham gia:</span>
                        <span className="font-medium">
                          {format(new Date(activeCustomer.joinDate), "dd/MM/yyyy", { locale: vi })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {activeCustomer.age && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Tuổi:</span>
                          <span className="font-medium">{activeCustomer.age}</span>
                        </div>
                      )}
                      {activeCustomer.gender && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Giới tính:</span>
                          <span className="font-medium">{activeCustomer.gender}</span>
                        </div>
                      )}
                      {activeCustomer.height && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Chiều cao:</span>
                          <span className="font-medium">{activeCustomer.height} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {activeCustomer.package && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Gói tập hiện tại
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{activeCustomer.package.name}</p>
                        <Badge variant={activeCustomer.package.status === "active" ? "default" : "secondary"}>
                          {activeCustomer.package.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                        </Badge>
                      </div>
                      {activeCustomer.package.type === "session" && activeCustomer.package.totalSessions && (
                        <div className="text-right">
                          <p className="text-xl font-bold sm:text-2xl">
                            {activeCustomer.package.totalSessions - sessionUsed}
                          </p>
                          <p className="text-xs text-muted-foreground">buổi còn lại</p>
                        </div>
                      )}
                    </div>
                    {activeCustomer.package.type === "session" && activeCustomer.package.totalSessions && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiến độ sử dụng</span>
                          <span className="font-medium">
                            {sessionUsed}/{activeCustomer.package.totalSessions}
                          </span>
                        </div>
                        <Progress
                          value={(sessionUsed / activeCustomer.package.totalSessions) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                    <Separator />
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày bắt đầu:</span>
                        <span>{format(new Date(activeCustomer.package.startDate), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      {activeCustomer.package.endDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày hết hạn:</span>
                          <span>{format(new Date(activeCustomer.package.endDate), "dd/MM/yyyy", { locale: vi })}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="exercises">
              <CustomerExercises
                customerId={activeCustomer.id}
                trainerId={trainerId}
                exercises={exercises}
                onUpdate={loadLocalData}
              />
            </TabsContent>

            <TabsContent value="diet">
              <CustomerDietPlan
                customerId={activeCustomer.id}
                trainerId={trainerId}
                dietPlans={dietPlans}
                onUpdate={loadLocalData}
              />
            </TabsContent>

            <TabsContent value="progress">
              <CustomerProgress customerId={activeCustomer.id} customer={activeCustomer} />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Lịch tập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {progress.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chưa có lịch tập</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {progress.map((record) => (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Buổi tập</p>
                            <Badge variant="outline">
                              {format(new Date(record.date), "dd/MM/yyyy", { locale: vi })}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Bài tập: {record.exercisesCount}</span>
                            {record.weight ? <span>Cân nặng: {record.weight} kg</span> : null}
                          </div>
                          {record.notes ? <p className="text-sm mt-2">{record.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Lịch sử check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendance.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chưa có lịch sử check-in</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attendance.map((record) => (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Check-in</p>
                            <Badge variant="outline">
                              {format(new Date(record.checkInTime), "dd/MM/yyyy", { locale: vi })}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Giờ vào: {format(new Date(record.checkInTime), "HH:mm", { locale: vi })}</span>
                            {record.checkOutTime ? (
                              <span>Giờ ra: {format(new Date(record.checkOutTime), "HH:mm", { locale: vi })}</span>
                            ) : null}
                            {record.duration ? <span>Thời lượng: {record.duration} phút</span> : null}
                          </div>
                          {record.workoutType ? <p className="text-sm mt-2">Loại buổi: {record.workoutType}</p> : null}
                          {record.notes ? <p className="text-sm mt-1">{record.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <CustomerChat
                customerId={activeCustomer.id}
                customerName={activeCustomer.name}
                trainerId={trainerId}
                trainerName={trainerName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

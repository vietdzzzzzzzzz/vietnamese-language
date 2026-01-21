"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"
import type { CustomerProfile, AssignedExercise, DietPlan, ExerciseHistory } from "@/types/trainer"
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
}

export function CustomerDetailView({
  customer,
  trainerId,
  trainerName,
  open,
  onOpenChange,
}: CustomerDetailViewProps) {
  const [exercises, setExercises] = useState<AssignedExercise[]>([])
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory[]>([])

  useEffect(() => {
    if (open && customer) {
      loadCustomerData()
    }
  }, [open, customer])

  const loadCustomerData = () => {
    // Load assigned exercises
    const exercisesKey = `assigned_exercises_${customer.id}`
    const savedExercises = localStorage.getItem(exercisesKey)
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    }

    // Load diet plans
    const dietKey = `diet_plans_${customer.id}`
    const savedDiet = localStorage.getItem(dietKey)
    if (savedDiet) {
      setDietPlans(JSON.parse(savedDiet))
    }

    // Load exercise history
    const historyKey = `exercise_history_${customer.id}`
    const savedHistory = localStorage.getItem(historyKey)
    if (savedHistory) {
      setExerciseHistory(JSON.parse(savedHistory))
    }
  }

  const getBMI = () => {
    if (customer.currentWeight && customer.height) {
      const heightInMeters = customer.height / 100
      return (customer.currentWeight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return "N/A"
  }

  const getProgressPercentage = () => {
    if (customer.currentWeight && customer.targetWeight) {
      const totalToLose = (customer.currentWeight || 0) - (customer.targetWeight || 0)
      return Math.min(100, Math.max(0, ((totalToLose / totalToLose) * 100)))
    }
    return 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-lg">{customer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-sm text-muted-foreground font-normal">Hồ sơ học viên</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Cân nặng hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.currentWeight || "N/A"} kg</div>
                <p className="text-xs text-muted-foreground">Mục tiêu: {customer.targetWeight || "N/A"} kg</p>
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
                <div className="text-2xl font-bold">{getBMI()}</div>
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
                <div className="text-2xl font-bold">
                  {customer.package?.usedSessions || 0}
                  {customer.package?.totalSessions ? `/${customer.package.totalSessions}` : ""}
                </div>
                <p className="text-xs text-muted-foreground">
                  {customer.package?.type === "session" ? "Theo buổi" : "Unlimited"}
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
                <div className="text-2xl font-bold">{customer.streak || 0} ngày</div>
                <p className="text-xs text-muted-foreground">Chuỗi tập luyện</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="info" className="w-full">
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
                        <span className="font-medium">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">SĐT:</span>
                          <span className="font-medium">{customer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Ngày tham gia:</span>
                        <span className="font-medium">
                          {format(new Date(customer.joinDate), "dd/MM/yyyy", { locale: vi })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {customer.age && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Tuổi:</span>
                          <span className="font-medium">{customer.age}</span>
                        </div>
                      )}
                      {customer.gender && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Giới tính:</span>
                          <span className="font-medium">{customer.gender}</span>
                        </div>
                      )}
                      {customer.height && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Chiều cao:</span>
                          <span className="font-medium">{customer.height} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {customer.package && (
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
                        <p className="font-semibold text-lg">{customer.package.name}</p>
                        <Badge variant={customer.package.status === "active" ? "default" : "secondary"}>
                          {customer.package.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                        </Badge>
                      </div>
                      {customer.package.type === "session" && customer.package.totalSessions && (
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {customer.package.totalSessions - customer.package.usedSessions}
                          </p>
                          <p className="text-xs text-muted-foreground">buổi còn lại</p>
                        </div>
                      )}
                    </div>
                    {customer.package.type === "session" && customer.package.totalSessions && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiến độ sử dụng</span>
                          <span className="font-medium">
                            {customer.package.usedSessions}/{customer.package.totalSessions}
                          </span>
                        </div>
                        <Progress
                          value={(customer.package.usedSessions / customer.package.totalSessions) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                    <Separator />
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày bắt đầu:</span>
                        <span>{format(new Date(customer.package.startDate), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      {customer.package.endDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày hết hạn:</span>
                          <span>{format(new Date(customer.package.endDate), "dd/MM/yyyy", { locale: vi })}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="exercises">
              <CustomerExercises
                customerId={customer.id}
                trainerId={trainerId}
                exercises={exercises}
                onUpdate={loadCustomerData}
              />
            </TabsContent>

            <TabsContent value="diet">
              <CustomerDietPlan
                customerId={customer.id}
                trainerId={trainerId}
                dietPlans={dietPlans}
                onUpdate={loadCustomerData}
              />
            </TabsContent>

            <TabsContent value="progress">
              <CustomerProgress customerId={customer.id} customer={customer} />
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Lịch sử tập luyện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {exerciseHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chưa có lịch sử tập luyện</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exerciseHistory.map((record: any) => (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{record.exerciseName}</p>
                            <Badge variant="outline">
                              {format(new Date(record.date), "dd/MM/yyyy", { locale: vi })}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            {record.sets?.map((set: any, idx: number) => (
                              <div key={idx} className="p-2 bg-muted rounded text-center">
                                <p className="text-xs text-muted-foreground">Set {idx + 1}</p>
                                <p className="font-medium">{set.reps} reps</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <CustomerChat
                customerId={customer.id}
                customerName={customer.name}
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
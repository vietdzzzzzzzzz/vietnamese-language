"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, TrendingUp, TrendingDown, MessageSquare, Calendar, Edit, Flame, Package, Eye } from "lucide-react"
import { AssignWorkout } from "./assign-workout"
import type { CustomerProfile } from "@/types/trainer"

interface MyClientsTabProps {
  trainerId: string
  onCustomerSelect: (customer: CustomerProfile) => void
}

const initialClients = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "member@gym.com",
    goal: "Giảm cân",
    startWeight: 75,
    currentWeight: 72,
    targetWeight: 68,
    joinDate: "2025-01-15",
    lastWorkout: "2025-01-28",
    attendance: 85,
    status: "active",
    totalWorkouts: 24,
    streak: 7,
    package: {
      id: "session-24",
      name: "Gói Tiêu chuẩn",
      type: "session" as const,
      totalSessions: 24,
      usedSessions: 18,
      price: 2200000,
      description: "",
      features: [],
    },
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "member2@gym.com",
    goal: "Tăng cơ",
    startWeight: 55,
    currentWeight: 57,
    targetWeight: 60,
    joinDate: "2024-12-20",
    lastWorkout: "2025-01-27",
    attendance: 92,
    status: "active",
    totalWorkouts: 38,
    streak: 12,
    package: {
      id: "duration-3",
      name: "Gói 3 tháng",
      type: "duration" as const,
      durationMonths: 3,
      startDate: "2024-12-20",
      price: 3900000,
      description: "",
      features: [],
    },
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "member3@gym.com",
    goal: "Tăng sức mạnh",
    startWeight: 70,
    currentWeight: 71,
    targetWeight: 75,
    joinDate: "2025-01-10",
    lastWorkout: "2025-01-25",
    attendance: 70,
    status: "active",
    totalWorkouts: 18,
    streak: 3,
    package: {
      id: "session-12",
      name: "Gói Cơ bản",
      type: "session" as const,
      totalSessions: 12,
      usedSessions: 8,
      price: 1200000,
      description: "",
      features: [],
    },
  },
]

export function MyClientsTab({ trainerId, onCustomerSelect }: MyClientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState(initialClients)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [streakDialogOpen, setStreakDialogOpen] = useState(false)
  const [tempStreak, setTempStreak] = useState("")
  const [packageDialogOpen, setPackageDialogOpen] = useState(false)
  const [tempUsedSessions, setTempUsedSessions] = useState("")

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getProgressPercent = (client: any) => {
    const totalChange = Math.abs(client.targetWeight - client.startWeight)
    const currentChange = Math.abs(client.currentWeight - client.startWeight)
    return Math.min((currentChange / totalChange) * 100, 100)
  }

  const handleEditStreak = (client: any) => {
    setEditingClient(client)
    setTempStreak(client.streak.toString())
    setStreakDialogOpen(true)
  }

  const handleSaveStreak = () => {
    if (!editingClient) return

    const streak = Number.parseInt(tempStreak) || 0

    setClients((prev) => prev.map((c) => (c.id === editingClient.id ? { ...c, streak: streak } : c)))

    setStreakDialogOpen(false)
    setEditingClient(null)
  }

  const handleEditPackage = (client: any) => {
    setEditingClient(client)
    if (client.package?.type === "session") {
      setTempUsedSessions((client.package.usedSessions || 0).toString())
    }
    setPackageDialogOpen(true)
  }

  const handleSavePackage = () => {
    if (!editingClient || !editingClient.package) return

    if (editingClient.package.type === "session") {
      const used = Number.parseInt(tempUsedSessions) || 0
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === editingClient.id && c.package && c.package.type === "session") {
            return {
              ...c,
              package: {
                ...c.package,
                usedSessions: used,
              },
            }
          }
          return c
        }),
      )
    }

    setPackageDialogOpen(false)
    setEditingClient(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách học viên</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <AssignWorkout />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredClients.map((client) => {
          const weightDiff = client.currentWeight - client.startWeight
          const progress = getProgressPercent(client)
          const remainingSessions =
            client.package?.type === "session"
              ? (client.package.totalSessions || 0) - (client.package.usedSessions || 0)
              : null

          return (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <Badge>{client.goal}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {client.package && (
                    <Card className="bg-accent/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">{client.package.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {client.package.type === "session" && (
                                  <>
                                    Còn {remainingSessions}/{client.package.totalSessions} buổi
                                  </>
                                )}
                                {client.package.type === "duration" && (
                                  <>Unlimited {client.package.durationMonths} tháng</>
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditPackage(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        {client.package.type === "session" && (
                          <Progress
                            value={((client.package.usedSessions || 0) / (client.package.totalSessions || 1)) * 100}
                            className="mt-2"
                          />
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tiến độ cân nặng</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{client.currentWeight} kg</span>
                        <div
                          className={`flex items-center gap-1 text-sm ${weightDiff > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {weightDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {Math.abs(weightDiff)} kg
                        </div>
                      </div>
                      <Progress value={progress} className="mt-2" />
                      <p className="text-xs text-muted-foreground">Mục tiêu: {client.targetWeight} kg</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tham gia</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{client.attendance}%</span>
                      </div>
                      <Progress value={client.attendance} className="mt-2" />
                      <p className="text-xs text-muted-foreground">Tỷ lệ đi tập</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tổng buổi tập</p>
                      <p className="text-2xl font-bold">{client.totalWorkouts}</p>
                      <p className="text-xs text-muted-foreground">buổi hoàn thành</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Streak hiện tại</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleEditStreak(client)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="text-2xl font-bold">{client.streak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">ngày liên tiếp</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      Giao bài tập
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Nhắn tin
                    </Button>
                    <Button onClick={() => onCustomerSelect({
                      id: client.id.toString(),
                      name: client.name,
                      email: client.email,
                      currentWeight: client.currentWeight,
                      targetWeight: client.targetWeight,
                      joinDate: new Date(client.joinDate),
                      status: client.status as "active" | "inactive",
                      package: client.package ? {
                        name: client.package.name,
                        type: client.package.type,
                        totalSessions: client.package.type === "session" ? client.package.totalSessions : undefined,
                        usedSessions: client.package.type === "session" ? (client.package.usedSessions || 0) : 0,
                        startDate: new Date(client.package.type === "session" ? client.joinDate : client.package.startDate || client.joinDate),
                        status: "active",
                      } : undefined,
                      streak: client.streak,
                      totalWorkouts: client.totalWorkouts,
                    })}>
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Streak Edit Dialog */}
      <Dialog open={streakDialogOpen} onOpenChange={setStreakDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Streak</DialogTitle>
            <DialogDescription>Cập nhật số ngày tập liên tiếp cho: {editingClient?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="streak">Streak (ngày liên tiếp)</Label>
              <Input
                id="streak"
                type="number"
                value={tempStreak}
                onChange={(e) => setTempStreak(e.target.value)}
                placeholder="Nhập số ngày liên tiếp"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStreakDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveStreak}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={packageDialogOpen} onOpenChange={setPackageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quản lý gói tập</DialogTitle>
            <DialogDescription>Cập nhật thông tin gói tập cho: {editingClient?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingClient?.package && (
              <>
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-semibold">{editingClient.package.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {editingClient.package.type === "session" ? "Theo buổi" : "Theo thời gian"}
                    </Badge>
                  </div>
                </div>

                {editingClient.package.type === "session" && (
                  <div className="space-y-2">
                    <Label htmlFor="used">Số buổi đã dùng</Label>
                    <Input
                      id="used"
                      type="number"
                      value={tempUsedSessions}
                      onChange={(e) => setTempUsedSessions(e.target.value)}
                      placeholder="Nhập số buổi đã dùng"
                      max={editingClient.package.totalSessions}
                    />
                    <p className="text-sm text-muted-foreground">Tổng số buổi: {editingClient.package.totalSessions}</p>
                    <p className="text-sm text-muted-foreground">
                      Còn lại: {editingClient.package.totalSessions - (Number.parseInt(tempUsedSessions) || 0)} buổi
                    </p>
                  </div>
                )}

                {editingClient.package.type === "duration" && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Gói theo thời gian (Unlimited)</p>
                    <p className="text-sm mt-1">Thời hạn: {editingClient.package.durationMonths} tháng</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Học viên có thể tập không giới hạn trong thời gian gói còn hiệu lực
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPackageDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSavePackage}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  onCustomerSelect: (customer: CustomerProfile, tab?: "info" | "exercises" | "chat") => void
}

type ClientPackage =
  | {
      id?: string
      name: string
      type: "session"
      totalSessions?: number
      usedSessions?: number
      price?: number
      description?: string
      features?: string[]
    }
  | {
      id?: string
      name: string
      type: "duration"
      durationMonths?: number
      startDate?: string
      price?: number
      description?: string
      features?: string[]
    }

type ClientItem = {
  id: string
  name: string
  email: string
  avatar?: string
  goal: string
  startWeight: number
  currentWeight: number
  targetWeight: number
  height?: number
  joinDate: string
  lastWorkout?: string
  attendance: number
  status: "active" | "inactive"
  totalWorkouts: number
  streak: number
  package?: ClientPackage
}

export function MyClientsTab({ trainerId, onCustomerSelect }: MyClientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState<ClientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [streakDialogOpen, setStreakDialogOpen] = useState(false)
  const [tempStreak, setTempStreak] = useState("")
  const [packageDialogOpen, setPackageDialogOpen] = useState(false)
  const [tempUsedSessions, setTempUsedSessions] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadClients = async () => {
      try {
        const response = await fetch("/api/trainer/members")
        if (!response.ok) {
          setError("Không thể tải danh sách học viên.")
          return
        }

        const data = await response.json()
        const members = Array.isArray(data?.members) ? data.members : []

        if (isMounted) {
          setClients(
            members.map((member: any) => {
              const currentWeight = Number(member.currentWeight || 0)
              const targetWeight = Number(member.targetWeight || 0)
              const totalAttendance = Number(member.totalAttendance || 0)
              const attendancePercent = Math.min(100, Math.round((totalAttendance / 30) * 100))

              return {
                id: member.id,
                name: member.name,
                email: member.email,
                avatar: member.avatar,
                goal: "Mục tiêu",
                startWeight: currentWeight || targetWeight || 0,
                currentWeight,
                targetWeight,
                height: Number(member.height || 0),
                joinDate: member.createdAt || new Date().toISOString(),
                attendance: attendancePercent,
                status: "active",
                totalWorkouts: Number(member.totalWorkouts || 0),
                streak: Number(member.streak || 0),
              }
            }),
          )
        }
      } catch (err) {
        if (isMounted) {
          setError("Không thể tải danh sách học viên.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadClients()
    return () => {
      isMounted = false
    }
  }, [trainerId])

  const filteredClients = clients.filter((client) => {
    const needle = searchQuery.trim().toLowerCase()
    if (!needle) return true
    return (
      client.name.toLowerCase().includes(needle) ||
      client.email.toLowerCase().includes(needle)
    )
  })

  const getProgressPercent = (client: ClientItem) => {
    const totalChange = Math.abs(client.targetWeight - client.startWeight)
    const currentChange = Math.abs(client.currentWeight - client.startWeight)
    if (!totalChange) return 0
    return Math.min((currentChange / totalChange) * 100, 100)
  }

  const getBMI = (client: ClientItem) => {
    if (!client.currentWeight || !client.height) return "N/A"
    const heightInMeters = client.height / 100
    return (client.currentWeight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const handleEditStreak = (client: ClientItem) => {
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

  const handleEditPackage = (client: ClientItem) => {
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
        <h2 className="text-xl font-bold sm:text-2xl">Danh sách học viên</h2>
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

      {loading && <p className="text-sm text-muted-foreground">Đang tải danh sách học viên...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && filteredClients.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có học viên nào.</p>
      )}

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
                      {client.avatar ? <AvatarImage src={client.avatar} alt={client.name} /> : null}
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
                        <span className="text-xl font-bold sm:text-2xl">
                          {client.currentWeight ? `${client.currentWeight} kg` : "N/A"}
                        </span>
                        <div
                          className={`flex items-center gap-1 text-sm ${weightDiff > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {weightDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {client.currentWeight ? `${Math.abs(weightDiff)} kg` : "0 kg"}
                        </div>
                      </div>
                      <Progress value={progress} className="mt-2" />
                      <p className="text-xs text-muted-foreground">
                        Mục tiêu: {client.targetWeight ? `${client.targetWeight} kg` : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">BMI: {getBMI(client)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tham gia</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold sm:text-2xl">{client.attendance}%</span>
                      </div>
                      <Progress value={client.attendance} className="mt-2" />
                      <p className="text-xs text-muted-foreground">Tỷ lệ đi tập</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tổng buổi tập</p>
                      <p className="text-xl font-bold sm:text-2xl">{client.totalWorkouts}</p>
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
                        <span className="text-xl font-bold sm:text-2xl">{client.streak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">ngày liên tiếp</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onCustomerSelect({
                          id: client.id.toString(),
                          name: client.name,
                          email: client.email,
                          avatar: client.avatar,
                          currentWeight: client.currentWeight,
                          targetWeight: client.targetWeight,
                          joinDate: new Date(client.joinDate),
                          status: client.status as "active" | "inactive",
                          package: client.package
                            ? {
                                name: client.package.name,
                                type: client.package.type,
                                totalSessions:
                                  client.package.type === "session" ? client.package.totalSessions : undefined,
                                usedSessions:
                                  client.package.type === "session" ? (client.package.usedSessions || 0) : 0,
                                startDate: new Date(
                                  client.package.type === "session" ? client.joinDate : client.joinDate,
                                ),
                                status: "active",
                              }
                            : undefined,
                          streak: client.streak,
                          totalWorkouts: client.totalWorkouts,
                        }, "exercises")}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Giao bài tập
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onCustomerSelect({
                          id: client.id.toString(),
                          name: client.name,
                          email: client.email,
                          avatar: client.avatar,
                          currentWeight: client.currentWeight,
                          targetWeight: client.targetWeight,
                          joinDate: new Date(client.joinDate),
                          status: client.status as "active" | "inactive",
                          package: client.package
                            ? {
                                name: client.package.name,
                                type: client.package.type,
                                totalSessions:
                                  client.package.type === "session" ? client.package.totalSessions : undefined,
                                usedSessions:
                                  client.package.type === "session" ? (client.package.usedSessions || 0) : 0,
                                startDate: new Date(
                                  client.package.type === "session" ? client.joinDate : client.joinDate,
                                ),
                                status: "active",
                              }
                            : undefined,
                          streak: client.streak,
                          totalWorkouts: client.totalWorkouts,
                        }, "chat")}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Nhắn tin
                    </Button>
                    <Button
                      onClick={() =>
                        onCustomerSelect({
                          id: client.id.toString(),
                          name: client.name,
                          email: client.email,
                          avatar: client.avatar,
                          currentWeight: client.currentWeight,
                          targetWeight: client.targetWeight,
                          joinDate: new Date(client.joinDate),
                          status: client.status as "active" | "inactive",
                          package: client.package
                            ? {
                                name: client.package.name,
                                type: client.package.type,
                                totalSessions:
                                  client.package.type === "session" ? client.package.totalSessions : undefined,
                                usedSessions:
                                  client.package.type === "session" ? (client.package.usedSessions || 0) : 0,
                                startDate: new Date(client.package.type === "session" ? client.joinDate : client.joinDate),
                                status: "active",
                              }
                            : undefined,
                          streak: client.streak,
                          totalWorkouts: client.totalWorkouts,
                        }, "info")
                      }
                    >
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

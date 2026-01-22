"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Dumbbell, Calendar, MessageSquare, LogOut, Library } from "lucide-react"
import { MyClientsTab } from "./my-clients-tab"
import { WorkoutManagement } from "./workout-management"
import { ClientMessaging } from "./client-messaging"
import { ExerciseManagement } from "../admin/exercise-management"
import { NotificationCenter } from "@/components/shared/notification-center"
import { BackButton } from "@/components/shared/back-button"
import { TetBanner } from "@/components/shared/tet-banner"
import { CustomerDetailView } from "./customer-detail-view"
import { AIChatInterface } from "@/components/ai/ai-chat-interface"
import type { CustomerProfile } from "@/types/trainer"

export function TrainerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalMembers: 0,
    workoutsCreated: 0,
    todaySessions: 0,
    todayCompleted: 0,
    unreadMessages: 0,
    newMembersLast30: 0,
    workoutsLast7: 0,
  })
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)
  const [customerTab, setCustomerTab] = useState<"info" | "exercises" | "chat">("info")

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const data = await response.json()
        if (data?.user?.role !== "trainer") {
          router.push("/")
          return
        }
        if (isMounted) {
          setUser(data.user)
        }
      } catch (error) {
        router.push("/login")
      }
    }

    loadUser()
    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {
    if (!user) return
    let isMounted = true

    const fetchStats = async () => {
      if (!isMounted) return
      await loadStats()
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [user])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/trainer/stats")
      if (!response.ok) return
      const data = await response.json()
      setStats({
        totalMembers: data.totalMembers || 0,
        workoutsCreated: data.workoutsCreated || 0,
        todaySessions: data.todaySessions || 0,
        todayCompleted: data.todayCompleted || 0,
        unreadMessages: data.unreadMessages || 0,
        newMembersLast30: data.newMembersLast30 || 0,
        workoutsLast7: data.workoutsLast7 || 0,
      })
    } catch (error) {
      // Ignore load errors for now
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 sm:px-8 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton fallbackHref="/trainer" />
              <Link href="/trainer" className="flex items-center gap-4">
                <Dumbbell className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">GYMORA Trainer</h1>
                  <p className="text-sm text-muted-foreground">Chào Coach {user.name}!</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Avatar>
                <AvatarFallback>{user.name?.[0] || "T"}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 sm:px-8 py-8 mx-auto">
        <TetBanner />

        {/* Stats Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">+{stats.newMembersLast30} tháng gần đây</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bài tập đã tạo</CardTitle>
              <Dumbbell className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{stats.workoutsCreated}</div>
              <p className="text-xs text-muted-foreground">+{stats.workoutsLast7} tuần này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Buổi tập hôm nay</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{stats.todaySessions}</div>
              <p className="text-xs text-muted-foreground">{stats.todayCompleted} đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tin nhắn mới</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages > 0 ? "Cần phản hồi" : "Không có tin mới"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
            <TabsTrigger value="clients" className="gap-1 text-xs leading-tight sm:gap-1.5 sm:text-sm">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Học viên
            </TabsTrigger>
            <TabsTrigger value="exercises" className="gap-1 text-xs leading-tight sm:gap-1.5 sm:text-sm">
              <Library className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Thư viện bài tập
            </TabsTrigger>
            <TabsTrigger value="workouts" className="gap-1 text-xs leading-tight sm:gap-1.5 sm:text-sm">
              <Dumbbell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Tạo bài tập
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1 text-xs leading-tight sm:gap-1.5 sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Tin nhắn
              {stats.unreadMessages > 0 ? (
                <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <MyClientsTab
              trainerId={user.id}
              onCustomerSelect={(customer, tab) => {
                setSelectedCustomer(customer)
                setCustomerTab(tab || "info")
                setShowCustomerDetail(true)
              }}
            />
          </TabsContent>

          <TabsContent value="exercises">
            <ExerciseManagement />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutManagement />
          </TabsContent>

          <TabsContent value="messages">
            <Tabs defaultValue="members" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">Học viên</TabsTrigger>
                <TabsTrigger value="ai">AI Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="members">
                <ClientMessaging trainerId={user.id} trainerName={user.name} />
              </TabsContent>
              <TabsContent value="ai">
                <AIChatInterface />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailView
          customer={selectedCustomer}
          trainerId={user.id}
          trainerName={user.name}
          open={showCustomerDetail}
          onOpenChange={setShowCustomerDetail}
          initialTab={customerTab}
        />
      )}
    </div>
  )
}

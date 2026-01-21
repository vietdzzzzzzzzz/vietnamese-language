"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Check, Dumbbell, MessageSquare, Calendar, TrendingUp, Package } from "lucide-react"

interface Notification {
  id: string
  type: "workout" | "message" | "progress" | "package" | "general"
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "workout",
    title: "Bài tập mới",
    message: "Coach đã giao bài tập mới: Ngày chân - Squat Focus",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "Tin nhắn mới",
    message: "Coach: Em làm tốt lắm! Tiếp tục phát huy nhé",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "3",
    type: "progress",
    title: "Cập nhật tiến độ",
    message: "Bạn đã giảm 2kg trong tháng này! Tuyệt vời!",
    time: "3 giờ trước",
    read: true,
  },
  {
    id: "4",
    type: "package",
    title: "Gói tập sắp hết hạn",
    message: "Gói tập của bạn còn 3 buổi. Đăng ký gia hạn ngay!",
    time: "1 ngày trước",
    read: true,
  },
]

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "workout":
      return <Dumbbell className="w-4 h-4" />
    case "message":
      return <MessageSquare className="w-4 h-4" />
    case "progress":
      return <TrendingUp className="w-4 h-4" />
    case "package":
      return <Package className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">Không có thông báo mới</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
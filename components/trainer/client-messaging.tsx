"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

interface ClientMessagingProps {
  trainerId: string
  trainerName: string
}

const conversations = [
  {
    id: 1,
    clientName: "Nguyễn Văn A",
    lastMessage: "Cảm ơn coach đã tạo bài tập mới!",
    time: "10 phút trước",
    unread: 2,
  },
  {
    id: 2,
    clientName: "Trần Thị B",
    lastMessage: "Em có thể tập thêm cardio không coach?",
    time: "1 giờ trước",
    unread: 1,
  },
  {
    id: 3,
    clientName: "Lê Văn C",
    lastMessage: "Hôm nay em nghỉ ạ",
    time: "3 giờ trước",
    unread: 0,
  },
]

export function ClientMessaging({ trainerId, trainerName }: ClientMessagingProps) {
  const [selectedClient, setSelectedClient] = useState<any>(conversations[0])
  const [message, setMessage] = useState("")

  const messages = [
    { id: 1, sender: "client", text: "Coach ơi, em muốn hỏi về kỹ thuật squat", time: "9:30" },
    { id: 2, sender: "trainer", text: "Chào em! Coach sẽ giải thích nhé. Khi squat, em cần chú ý...", time: "9:32" },
    { id: 3, sender: "client", text: "Vâng em hiểu rồi ạ. Cảm ơn coach!", time: "9:35" },
    { id: 4, sender: "trainer", text: "Coach vừa tạo bài tập mới cho em đấy, em xem nhé!", time: "10:00" },
    { id: 5, sender: "client", text: "Cảm ơn coach đã tạo bài tập mới!", time: "10:05" },
  ]

  const handleSend = () => {
    if (!message.trim()) return
    // Handle send message
    setMessage("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Tin nhắn</h3>
          </div>
          <div className="divide-y">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedClient(conv)}
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                  selectedClient?.id === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{conv.clientName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{conv.clientName}</p>
                      {conv.unread > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{selectedClient?.clientName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedClient?.clientName}</h3>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${msg.sender === "trainer" ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.sender === "trainer" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." />
            <Button type="submit">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

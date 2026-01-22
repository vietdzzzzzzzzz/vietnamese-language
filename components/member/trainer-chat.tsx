"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send } from "lucide-react"
import type { ChatMessage } from "@/types/trainer"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

type TrainerItem = {
  id: string
  name: string
  email: string
  avatar?: string
}

export function TrainerChat() {
  const [trainers, setTrainers] = useState<TrainerItem[]>([])
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("")
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerItem | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadTrainers = async () => {
      try {
        const response = await fetch("/api/trainers")
        if (!response.ok) return
        const data = await response.json()
        const items = Array.isArray(data?.trainers) ? data.trainers : []
        if (isMounted) {
          setTrainers(items)
          if (items.length > 0) {
            setSelectedTrainerId(items[0].id)
            setSelectedTrainer(items[0])
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTrainers()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedTrainerId) return
    const trainer = trainers.find((item) => item.id === selectedTrainerId) || null
    setSelectedTrainer(trainer)
  }, [selectedTrainerId, trainers])

  useEffect(() => {
    if (!selectedTrainerId) return
    let isMounted = true

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat?otherId=${selectedTrainerId}`)
        if (!response.ok) return
        const data = await response.json()
        const parsed = Array.isArray(data?.messages) ? data.messages : []
        if (isMounted) {
          setMessages(
            parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [selectedTrainerId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTrainerId) return

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId: selectedTrainerId, message: newMessage.trim() }),
    })

    if (response.ok) {
      const data = await response.json()
      const msg = data?.message
      if (msg) {
        setMessages((prev) => [...prev, { ...msg, timestamp: new Date(msg.timestamp) }])
      }
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat với huấn luyện viên
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {selectedTrainer?.avatar ? (
                <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
              ) : null}
              <AvatarFallback>{selectedTrainer?.name?.[0] || "T"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn huấn luyện viên" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTrainer?.email ? (
                <p className="text-xs text-muted-foreground mt-1">{selectedTrainer.email}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">Đang tải tin nhắn...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Chưa có tin nhắn
                <br />
                Bắt đầu cuộc trò chuyện với huấn luyện viên
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMember = message.toId === selectedTrainerId
              return (
                <div key={message.id} className={`flex gap-3 ${isMember ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {isMember ? null : selectedTrainer?.avatar ? (
                      <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {isMember ? "B" : selectedTrainer?.name?.[0] || "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isMember ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isMember ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(message.timestamp), "HH:mm dd/MM", { locale: vi })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !selectedTrainerId}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

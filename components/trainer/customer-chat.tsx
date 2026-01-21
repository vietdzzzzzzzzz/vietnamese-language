"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageSquare } from "lucide-react"
import type { ChatMessage } from "@/types/trainer"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CustomerChatProps {
  customerId: string
  customerName: string
  trainerId: string
  trainerName: string
}

export function CustomerChat({ customerId, customerName, trainerId, trainerName }: CustomerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [customerId, trainerId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = () => {
    const chatKey = `chat_${trainerId}_${customerId}`
    const savedMessages = localStorage.getItem(chatKey)
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(messagesWithDates)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `${Date.now()}`,
      fromId: trainerId,
      toId: customerId,
      fromName: trainerName,
      toName: customerName,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    }

    const chatKey = `chat_${trainerId}_${customerId}`
    const updated = [...messages, message]
    localStorage.setItem(chatKey, JSON.stringify(updated))
    setMessages(updated)
    setNewMessage("")
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
          Chat với {customerName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Chưa có tin nhắn
                <br />
                Bắt đầu cuộc trò chuyện với học viên
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isTrainer = message.fromId === trainerId
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isTrainer ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {isTrainer ? trainerName[0] : customerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isTrainer ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isTrainer
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
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
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
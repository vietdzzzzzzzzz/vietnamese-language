"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { CustomerChat } from "./customer-chat"

interface ClientMessagingProps {
  trainerId: string
  trainerName: string
}

interface MemberSummary {
  id: string
  name?: string
  email?: string
  avatar?: string
}

export function ClientMessaging({ trainerId, trainerName }: ClientMessagingProps) {
  const [members, setMembers] = useState<MemberSummary[]>([])
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadMembers = async () => {
      try {
        const response = await fetch("/api/trainer/members")
        if (!response.ok) return
        const data = await response.json()
        const list = Array.isArray(data?.members) ? data.members : []
        if (isMounted) {
          setMembers(list)
          setSelectedMember(list[0] ?? null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMembers()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Tin nhắn</h3>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">Đang tải danh sách học viên...</div>
            ) : members.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">Chưa có học viên.</div>
            ) : (
              members.map((member) => {
                const label = member.name || member.email || "Học viên"
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedMember?.id === member.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{label[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{label}</p>
                        {member.email && <p className="text-sm text-muted-foreground truncate">{member.email}</p>}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {selectedMember ? (
          <CustomerChat
            customerId={selectedMember.id}
            customerName={selectedMember.name || selectedMember.email || "Học viên"}
            trainerId={trainerId}
            trainerName={trainerName}
          />
        ) : (
          <Card className="h-[600px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <MessageSquare className="h-12 w-12" />
            <p>Chọn một học viên để bắt đầu trò chuyện.</p>
            <Button variant="outline" onClick={() => setSelectedMember(members[0] ?? null)} disabled={!members[0]}>
              Mở cuộc trò chuyện đầu tiên
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

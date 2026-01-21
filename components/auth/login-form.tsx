"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check for default admin account
    if (email === "admin123" && password === "12345") {
      const adminData = {
        email: "admin123",
        role: "admin",
        name: "Administrator",
      }
      sessionStorage.setItem("user", JSON.stringify(adminData))
      setTimeout(() => {
        router.push("/admin")
        setLoading(false)
      }, 1000)
      return
    }

    // Mock authentication - redirect based on email domain
    setTimeout(() => {
      // Store user data in sessionStorage (temporary until database is added)
      const userData = {
        email,
        role: email.includes("trainer") ? "trainer" : "member",
        name: email.split("@")[0],
      }
      sessionStorage.setItem("user", JSON.stringify(userData))

      // Redirect based on role
      if (userData.role === "trainer") {
        router.push("/trainer")
      } else {
        router.push("/member")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Demo: dùng &quot;member@gym.com&quot; hoặc &quot;trainer@gym.com&quot;<br />
              Admin: &quot;admin123&quot; / &quot;12345&quot;
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

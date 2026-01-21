import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span>GYMORA</span>
          </Link>
          <h1 className="text-3xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground">Chào mừng trở lại! Đăng nhập để tiếp tục</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

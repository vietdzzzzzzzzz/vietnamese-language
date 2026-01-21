import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span>GYMORA</span>
          </Link>
          <h1 className="text-3xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-muted-foreground">Tạo tài khoản mới để bắt đầu</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

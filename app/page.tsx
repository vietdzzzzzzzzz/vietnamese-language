import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dumbbell, Users, Brain, TrendingUp, Zap, Target } from "lucide-react"
import { SpringGifs } from "@/components/shared/spring-gifs"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container px-4 py-4 mx-auto">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Dumbbell className="w-6 h-6 text-primary" />
              GYMORA
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/exercises">Thư viện bài tập</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container px-4 py-20 mx-auto md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                Powered by AI
              </div>
              <h1 className="text-5xl font-bold tracking-tight lg:text-6xl text-balance">
                GYMORA - Quản lý phòng gym thông minh với AI
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Hệ thống quản lý toàn diện cho member, trainer và admin. AI theo dõi tiến độ, tạo kế hoạch tập luyện cá
                nhân hóa và tư vấn chuyên nghiệp 24/7.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                  <Link href="/register">Đăng ký ngay</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="/modern-gym-interior.png" alt="GYMORA Gym Management" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <SpringGifs />

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Tính năng vượt trội</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Giải pháp toàn diện cho mọi thành viên trong phòng gym
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI Phân tích tiến độ</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI phân tích dữ liệu tập luyện và đưa ra nhận xét, khuyến nghị cải thiện hiệu suất tự động.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Kế hoạch cá nhân hóa</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI tạo workout plan phù hợp với mục tiêu, trình độ và thể trạng của từng member.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Chat AI hỗ trợ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Trò chuyện với AI trainer 24/7 để được tư vấn kỹ thuật, dinh dưỡng và động lực tập luyện.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Theo dõi tiến độ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biểu đồ trực quan hiển thị tiến độ cân nặng, số đo và sức mạnh theo thời gian.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quản lý member</h3>
              <p className="text-muted-foreground leading-relaxed">
                Trainer theo dõi tiến độ học viên, giao bài tập và tương tác trực tiếp qua hệ thống.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Admin Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quản lý toàn bộ phòng gym: member, trainer, gói tập và thống kê doanh thu.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-muted/30 border-t">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-balance">Sẵn sàng nâng cấp phòng gym của bạn?</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Bắt đầu ngay hôm nay với hệ thống quản lý gym hiện đại nhất
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/register">Dùng thử miễn phí</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/contact">Liên hệ tư vấn</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

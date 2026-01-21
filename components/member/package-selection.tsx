"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Zap } from "lucide-react"
import type { Package } from "@/types/package"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const availablePackages: Package[] = [
  {
    id: "session-12",
    name: "Gói Cơ bản",
    type: "session",
    totalSessions: 12,
    price: 1200000,
    description: "Phù hợp cho người mới bắt đầu",
    features: ["12 buổi tập", "Tư vấn chế độ ăn cơ bản", "Hỗ trợ trainer", "Có hiệu lực 3 tháng"],
  },
  {
    id: "session-24",
    name: "Gói Tiêu chuẩn",
    type: "session",
    totalSessions: 24,
    price: 2200000,
    description: "Lựa chọn phổ biến nhất",
    features: ["24 buổi tập", "Tư vấn chế độ ăn chi tiết", "Hỗ trợ trainer ưu tiên", "Có hiệu lực 6 tháng"],
  },
  {
    id: "session-36",
    name: "Gói Cao cấp",
    type: "session",
    totalSessions: 36,
    price: 3000000,
    description: "Tốt nhất cho cam kết dài hạn",
    features: [
      "36 buổi tập",
      "Chế độ ăn cá nhân hóa",
      "Trainer riêng 1-1",
      "Phân tích AI miễn phí",
      "Có hiệu lực 12 tháng",
    ],
  },
  {
    id: "duration-1",
    name: "Gói 1 tháng",
    type: "duration",
    durationMonths: 1,
    price: 1500000,
    description: "Tập không giới hạn",
    features: ["Tập không giới hạn 30 ngày", "Truy cập full thiết bị", "Hỗ trợ trainer cơ bản"],
  },
  {
    id: "duration-3",
    name: "Gói 3 tháng",
    type: "duration",
    durationMonths: 3,
    price: 3900000,
    description: "Tiết kiệm 13%",
    features: [
      "Tập không giới hạn 90 ngày",
      "Truy cập full thiết bị",
      "Hỗ trợ trainer ưu tiên",
      "1 buổi tư vấn miễn phí",
    ],
  },
  {
    id: "duration-6",
    name: "Gói 6 tháng",
    type: "duration",
    durationMonths: 6,
    price: 7200000,
    description: "Tiết kiệm 20%",
    features: [
      "Tập không giới hạn 180 ngày",
      "Truy cập full thiết bị",
      "Trainer riêng hàng tuần",
      "Phân tích AI miễn phí",
      "Ưu đãi đặc biệt",
    ],
  },
]

interface PackageSelectionProps {
  currentPackage?: Package
  onSelectPackage?: (pkg: Package) => void
}

export function PackageSelection({ currentPackage, onSelectPackage }: PackageSelectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setConfirmDialogOpen(true)
  }

  const handleConfirmPurchase = () => {
    if (selectedPackage) {
      // Save to localStorage
      const userPackage = {
        userId: 1, // Mock user ID
        package: selectedPackage,
        purchaseDate: new Date().toISOString(),
        status: "active",
      }
      localStorage.setItem("userPackage", JSON.stringify(userPackage))

      if (onSelectPackage) {
        onSelectPackage(selectedPackage)
      }
    }
    setConfirmDialogOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chọn gói tập phù hợp</h2>
        <p className="text-muted-foreground">Chọn gói tập phù hợp với nhu cầu và mục tiêu của bạn</p>
      </div>

      {/* Session Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Gói theo buổi tập</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {availablePackages
            .filter((pkg) => pkg.type === "session")
            .map((pkg) => (
              <Card key={pkg.id} className={currentPackage?.id === pkg.id ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pkg.name}</CardTitle>
                    {currentPackage?.id === pkg.id && <Badge>Đang dùng</Badge>}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold">{formatPrice(pkg.price)}</div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.totalSessions} buổi • {(pkg.price / pkg.totalSessions!).toLocaleString("vi-VN")}đ/buổi
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={currentPackage?.id === pkg.id}
                  >
                    {currentPackage?.id === pkg.id ? "Gói hiện tại" : "Chọn gói này"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      {/* Duration Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Gói theo thời gian (Unlimited)</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {availablePackages
            .filter((pkg) => pkg.type === "duration")
            .map((pkg) => (
              <Card key={pkg.id} className={currentPackage?.id === pkg.id ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pkg.name}</CardTitle>
                    {currentPackage?.id === pkg.id && <Badge>Đang dùng</Badge>}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold">{formatPrice(pkg.price)}</div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.durationMonths} tháng • {(pkg.price / pkg.durationMonths!).toLocaleString("vi-VN")}đ/tháng
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={currentPackage?.id === pkg.id}
                  >
                    {currentPackage?.id === pkg.id ? "Gói hiện tại" : "Chọn gói này"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đăng ký gói</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn đăng ký gói này?</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tên gói:</span>
                <span className="font-semibold">{selectedPackage.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loại gói:</span>
                <Badge>{selectedPackage.type === "session" ? "Theo buổi" : "Theo thời gian"}</Badge>
              </div>
              {selectedPackage.type === "session" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Số buổi:</span>
                  <span className="font-semibold">{selectedPackage.totalSessions} buổi</span>
                </div>
              )}
              {selectedPackage.type === "duration" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Thời hạn:</span>
                  <span className="font-semibold">{selectedPackage.durationMonths} tháng</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(selectedPackage.price)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmPurchase}>Xác nhận đăng ký</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

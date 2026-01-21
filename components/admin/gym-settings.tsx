"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function GymSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cài đặt phòng gym</h2>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
          <CardDescription>Cài đặt thông tin cơ bản của phòng gym</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gym-name">Tên phòng gym</Label>
            <Input id="gym-name" defaultValue="GYMORA Fitness Center" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-address">Địa chỉ</Label>
            <Input id="gym-address" defaultValue="123 Đường ABC, Quận 1, TP.HCM" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-phone">Số điện thoại</Label>
            <Input id="gym-phone" defaultValue="0123 456 789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-email">Email</Label>
            <Input id="gym-email" type="email" defaultValue="contact@gymora.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-description">Mô tả</Label>
            <Textarea
              id="gym-description"
              defaultValue="Phòng gym hiện đại với hệ thống AI quản lý thông minh"
              rows={3}
            />
          </div>
          <Button>Lưu thay đổi</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gói tập</CardTitle>
          <CardDescription>Quản lý các gói tập và giá</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Gói Basic</p>
                <p className="text-sm text-muted-foreground">300,000 VNĐ/tháng</p>
              </div>
              <Button variant="outline" size="sm">
                Chỉnh sửa
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Gói Premium</p>
                <p className="text-sm text-muted-foreground">800,000 VNĐ/tháng</p>
              </div>
              <Button variant="outline" size="sm">
                Chỉnh sửa
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Gói VIP</p>
                <p className="text-sm text-muted-foreground">1,200,000 VNĐ/tháng</p>
              </div>
              <Button variant="outline" size="sm">
                Chỉnh sửa
              </Button>
            </div>
          </div>
          <Button variant="outline">Thêm gói mới</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt AI</CardTitle>
          <CardDescription>Tùy chỉnh các tính năng AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>AI Chat hỗ trợ</Label>
              <p className="text-sm text-muted-foreground">Cho phép member chat với AI Trainer</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>AI Phân tích tiến độ</Label>
              <p className="text-sm text-muted-foreground">Tự động phân tích và gợi ý cải thiện</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>AI Tạo bài tập</Label>
              <p className="text-sm text-muted-foreground">Cho phép AI tạo workout plan tự động</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>Lưu cài đặt</Button>
        </CardContent>
      </Card>
    </div>
  )
}

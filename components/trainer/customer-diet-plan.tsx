"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, UtensilsCrossed, Apple } from "lucide-react"
import type { DietPlan } from "@/types/trainer"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CustomerDietPlanProps {
  customerId: string
  trainerId: string
  dietPlans: DietPlan[]
  onUpdate: () => void
}

export function CustomerDietPlan({ customerId, trainerId, dietPlans, onUpdate }: CustomerDietPlanProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [meals, setMeals] = useState<DietPlan["meals"]>([
    { type: "Sáng", time: "07:00", foods: [], notes: "" },
  ])
  const [currentMealFood, setCurrentMealFood] = useState("")
  const [notes, setNotes] = useState("")

  const addMeal = () => {
    setMeals([...meals, { type: "Trưa", time: "12:00", foods: [], notes: "" }])
  }

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index))
  }

  const updateMeal = (index: number, field: string, value: any) => {
    const updated = [...meals]
    updated[index] = { ...updated[index], [field]: value }
    setMeals(updated)
  }

  const addFoodToMeal = (mealIndex: number, food: string) => {
    if (!food.trim()) return
    const updated = [...meals]
    updated[mealIndex].foods.push(food.trim())
    setMeals(updated)
  }

  const removeFoodFromMeal = (mealIndex: number, foodIndex: number) => {
    const updated = [...meals]
    updated[mealIndex].foods = updated[mealIndex].foods.filter((_, i) => i !== foodIndex)
    setMeals(updated)
  }

  const handleSaveDietPlan = () => {
    const newPlan: DietPlan = {
      id: `${Date.now()}`,
      customerId,
      trainerId,
      date: new Date(),
      meals,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const dietKey = `diet_plans_${customerId}`
    const existing = localStorage.getItem(dietKey)
    const updated = existing ? [...JSON.parse(existing), newPlan] : [newPlan]
    localStorage.setItem(dietKey, JSON.stringify(updated))

    // Reset form
    setMeals([{ type: "Sáng", time: "07:00", foods: [], notes: "" }])
    setNotes("")
    setIsDialogOpen(false)
    onUpdate()
  }

  const handleDeletePlan = (planId: string) => {
    const dietKey = `diet_plans_${customerId}`
    const updated = dietPlans.filter((plan) => plan.id !== planId)
    localStorage.setItem(dietKey, JSON.stringify(updated))
    onUpdate()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chế độ ăn</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tạo thực đơn
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo thực đơn cho học viên</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {meals.map((meal, mealIndex) => (
                <Card key={mealIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Bữa {mealIndex + 1}</CardTitle>
                      {meals.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMeal(mealIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Loại bữa</Label>
                        <Select
                          value={meal.type}
                          onValueChange={(value: any) => updateMeal(mealIndex, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sáng">Bữa sáng</SelectItem>
                            <SelectItem value="Trưa">Bữa trưa</SelectItem>
                            <SelectItem value="Tối">Bữa tối</SelectItem>
                            <SelectItem value="Phụ">Bữa phụ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Thời gian</Label>
                        <Input
                          type="time"
                          value={meal.time}
                          onChange={(e) => updateMeal(mealIndex, "time", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Thực phẩm</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập tên món ăn..."
                          value={currentMealFood}
                          onChange={(e) => setCurrentMealFood(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addFoodToMeal(mealIndex, currentMealFood)
                              setCurrentMealFood("")
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addFoodToMeal(mealIndex, currentMealFood)
                            setCurrentMealFood("")
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                      {meal.foods.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meal.foods.map((food, foodIndex) => (
                            <Badge key={foodIndex} variant="secondary" className="gap-1">
                              {food}
                              <button
                                onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Ghi chú bữa ăn</Label>
                      <Textarea
                        value={meal.notes || ""}
                        onChange={(e) => updateMeal(mealIndex, "notes", e.target.value)}
                        placeholder="VD: Uống đủ nước, tránh đồ chiên..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={addMeal} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Thêm bữa ăn
              </Button>

              <div className="space-y-2">
                <Label>Ghi chú chung</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú chung về chế độ ăn..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveDietPlan}>Lưu thực đơn</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {dietPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Apple className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Chưa có thực đơn nào
              <br />
              Tạo thực đơn đầu tiên cho học viên
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dietPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Thực đơn ngày {format(new Date(plan.date), "dd/MM/yyyy", { locale: vi })}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.meals.map((meal, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>{meal.type}</Badge>
                        <span className="text-sm text-muted-foreground">{meal.time}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Món ăn:</p>
                      <div className="flex flex-wrap gap-2">
                        {meal.foods.map((food, foodIndex) => (
                          <Badge key={foodIndex} variant="outline">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {meal.notes && (
                      <p className="text-sm text-muted-foreground italic">{meal.notes}</p>
                    )}
                  </div>
                ))}
                {plan.notes && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Ghi chú:</strong> {plan.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
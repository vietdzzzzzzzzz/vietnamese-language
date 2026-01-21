"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Apple, Flame, Droplet, PlusCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

interface NutritionLog {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

export function NutritionTracker() {
  const [goals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    water: 2500,
  })

  const [consumed, setConsumed] = useState<NutritionLog>({
    calories: 1200,
    protein: 80,
    carbs: 120,
    fat: 40,
    water: 1500,
  })

  const [mealName, setMealName] = useState("")
  const [mealCalories, setMealCalories] = useState("")
  const [mealProtein, setMealProtein] = useState("")
  const [mealCarbs, setMealCarbs] = useState("")
  const [mealFat, setMealFat] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const addMeal = () => {
    const newConsumed = {
      calories: consumed.calories + Number(mealCalories || 0),
      protein: consumed.protein + Number(mealProtein || 0),
      carbs: consumed.carbs + Number(mealCarbs || 0),
      fat: consumed.fat + Number(mealFat || 0),
      water: consumed.water,
    }

    setConsumed(newConsumed)
    setMealName("")
    setMealCalories("")
    setMealProtein("")
    setMealCarbs("")
    setMealFat("")
    setIsOpen(false)

    toast({
      title: "Đã thêm bữa ăn",
      description: `${mealName} - ${mealCalories} kcal`,
    })
  }

  const addWater = () => {
    setConsumed({
      ...consumed,
      water: consumed.water + 250,
    })
  }

  const calcProgress = (current: number, goal: number) => Math.min((current / goal) * 100, 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theo dõi dinh dưỡng</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm bữa ăn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm bữa ăn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Tên món ăn</Label>
                <Input
                  id="meal-name"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="VD: Cơm gà"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" type="number" value={mealCarbs} onChange={(e) => setMealCarbs(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input id="fat" type="number" value={mealFat} onChange={(e) => setMealFat(e.target.value)} />
                </div>
              </div>
              <Button onClick={addMeal} className="w-full">
                Thêm bữa ăn
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{consumed.calories}</span>
                <span className="text-sm text-muted-foreground">/ {goals.calories} kcal</span>
              </div>
              <Progress value={calcProgress(consumed.calories, goals.calories)} />
              <p className="text-xs text-muted-foreground">
                Còn lại: {Math.max(0, goals.calories - consumed.calories)} kcal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nước uống</CardTitle>
            <Droplet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{consumed.water}</span>
                <span className="text-sm text-muted-foreground">/ {goals.water} ml</span>
              </div>
              <Progress value={calcProgress(consumed.water, goals.water)} />
              <Button onClick={addWater} variant="outline" size="sm" className="w-full mt-2">
                <Droplet className="w-4 h-4 mr-2" />
                Thêm 250ml
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Apple className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{consumed.protein}g</span>
                <span className="text-sm text-muted-foreground">/ {goals.protein}g</span>
              </div>
              <Progress value={calcProgress(consumed.protein, goals.protein)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <Apple className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{consumed.carbs}g</span>
                <span className="text-sm text-muted-foreground">/ {goals.carbs}g</span>
              </div>
              <Progress value={calcProgress(consumed.carbs, goals.carbs)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
            <Apple className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{consumed.fat}g</span>
                <span className="text-sm text-muted-foreground">/ {goals.fat}g</span>
              </div>
              <Progress value={calcProgress(consumed.fat, goals.fat)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
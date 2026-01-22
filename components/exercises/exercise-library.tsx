"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Dumbbell, BookOpen, Video } from "lucide-react"
import { BackButton } from "@/components/shared/back-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const exercises = [
  {
    id: 1,
    name: "Squat",
    category: "Legs",
    difficulty: "Trung bình",
    equipment: "Barbell",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    description: "Động tác cơ bản nhất để phát triển chân, mông và cơ lưng dưới.",
    instructions: [
      "Đứng thẳng, chân rộng bằng vai, ngón chân hơi xoay ra ngoài",
      "Đặt thanh tạ lên vai sau, giữ lưng thẳng",
      "Hít vào, từ từ hạ người xuống như đang ngồi xuống ghế",
      "Đùi song song với mặt đất hoặc sâu hơn",
      "Thở ra, đẩy gót chân để đứng lên",
    ],
    tips: ["Giữ đầu gối không vượt quá mũi bàn chân", "Lưng luôn thẳng", "Nhìn thẳng về phía trước"],
    videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
  },
  {
    id: 2,
    name: "Bench Press",
    category: "Chest",
    difficulty: "Trung bình",
    equipment: "Barbell",
    muscles: ["Pectoralis", "Triceps", "Anterior Deltoids"],
    description: "Bài tập cơ bản để phát triển ngực, vai trước và tay sau.",
    instructions: [
      "Nằm ngửa trên ghế, lưng ép sát ghế",
      "Nắm thanh tạ rộng hơn vai, tay thẳng",
      "Hít vào, hạ thanh tạ xuống giữa ngực",
      "Chạm nhẹ vào ngực",
      "Thở ra, đẩy thanh tạ lên về vị trí ban đầu",
    ],
    tips: ["Chân đặt chắc trên sàn", "Vai không rời khỏi ghế", "Khuỷu tay góc 45 độ"],
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
  },
  {
    id: 3,
    name: "Deadlift",
    category: "Back",
    difficulty: "Khó",
    equipment: "Barbell",
    muscles: ["Erector Spinae", "Glutes", "Hamstrings", "Traps"],
    description: "Động tác tổng hợp phát triển toàn thân, đặc biệt lưng và chân.",
    instructions: [
      "Đứng trước thanh tạ, chân rộng bằng hông",
      "Cúi xuống nắm thanh, tay rộng hơn chân",
      "Giữ lưng thẳng, ngực đẩy ra",
      "Hít vào, kéo thanh lên bằng cách duỗi hông và đầu gối",
      "Đứng thẳng hoàn toàn, vai ra sau",
      "Hạ thanh xuống với động tác ngược lại",
    ],
    tips: ["QUAN TRỌNG: Lưng luôn thẳng", "Thanh sát với người", "Kéo bằng chân và hông, không phải lưng"],
  },
  {
    id: 4,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Khó",
    equipment: "Pull-up Bar",
    muscles: ["Latissimus Dorsi", "Biceps", "Traps"],
    description: "Bài tập tuyệt vời cho lưng xô và tay trước.",
    instructions: [
      "Treo người trên xà, tay nắm rộng hơn vai",
      "Người thẳng, chân gập hoặc duỗi",
      "Kéo người lên cho đến khi cằm vượt qua xà",
      "Giữ 1 giây ở trên",
      "Hạ người xuống từ từ về vị trí ban đầu",
    ],
    tips: ["Không xoay người", "Vai không co lại", "Động tác chậm và kiểm soát"],
  },
  {
    id: 5,
    name: "Shoulder Press",
    category: "Shoulders",
    difficulty: "Trung bình",
    equipment: "Dumbbell",
    muscles: ["Deltoids", "Triceps", "Upper Chest"],
    description: "Phát triển vai, tay sau và ngực trên.",
    instructions: [
      "Ngồi thẳng lưng, giữ 2 tạ đơn ở vai",
      "Lòng bàn tay hướng về phía trước",
      "Đẩy tạ lên trên đầu cho đến khi tay gần thẳng",
      "Tạ gần chạm nhau ở trên",
      "Hạ tạ xuống về vị trí vai",
    ],
    tips: ["Không khóa khuỷu hoàn toàn", "Lưng thẳng, không dùng đà", "Thở đều"],
  },
  {
    id: 6,
    name: "Bicep Curls",
    category: "Arms",
    difficulty: "Dễ",
    equipment: "Dumbbell",
    muscles: ["Biceps Brachii"],
    description: "Bài tập cô lập cho cơ tay trước.",
    instructions: [
      "Đứng thẳng, giữ 2 tạ đơn hai bên người",
      "Khuỷu tay sát thân, lòng bàn tay hướng lên",
      "Uốn khuỷu, nâng tạ lên vai",
      "Co cơ tay trước ở trên cùng",
      "Hạ tạ xuống chậm về vị trí ban đầu",
    ],
    tips: ["Khuỷu tay cố định", "Không xoay người", "Động tác chậm và kiểm soát"],
  },
]

const categories = ["All", "Legs", "Chest", "Back", "Shoulders", "Arms"]

export function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container px-4 sm:px-8 py-4 mx-auto">
          <div className="flex items-center gap-4">
            <BackButton fallbackHref="/" />
            <Link href="/" className="flex items-center gap-4">
            <Dumbbell className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Thư viện bài tập</h1>
              <p className="text-sm text-muted-foreground">Hướng dẫn chi tiết các động tác tập luyện</p>
            </div>
          </Link>
          </div>
        </div>
      </header>

      <div className="container px-4 sm:px-8 py-8 mx-auto">
        <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài tập hoặc nhóm cơ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{exercise.category}</Badge>
                        <Badge>{exercise.difficulty}</Badge>
                        {exercise.videoUrl && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
                    <div>
                      <p className="text-sm font-medium mb-2">Nhóm cơ:</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.muscles.map((muscle) => (
                          <Badge key={muscle} variant="secondary">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Dụng cụ: {exercise.equipment}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Xem hướng dẫn
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5" />
                            {exercise.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {exercise.videoUrl && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                              <iframe
                                src={exercise.videoUrl}
                                title={exercise.name}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}

                          <div>
                            <p className="text-muted-foreground leading-relaxed">{exercise.description}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Các bước thực hiện:</h3>
                            <ol className="space-y-2">
                              {exercise.instructions.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm leading-relaxed pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                            <h3 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">
                              Lưu ý quan trọng:
                            </h3>
                            <ul className="space-y-1">
                              {exercise.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2" />
                                  <span className="leading-relaxed text-orange-900 dark:text-orange-100">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Nhóm cơ:</strong> {exercise.muscles.join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Dụng cụ:</strong> {exercise.equipment}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Độ khó:</strong> {exercise.difficulty}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

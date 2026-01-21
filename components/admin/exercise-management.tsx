"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Edit, Trash2, Video, Eye, Search } from "lucide-react"
import type { Exercise } from "@/types/exercise"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockExercises: Exercise[] = [
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
]

export function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: "",
    category: "Legs",
    difficulty: "Trung bình",
    equipment: "",
    muscles: [],
    description: "",
    instructions: [],
    tips: [],
    videoUrl: "",
  })

  const categories = ["All", "Legs", "Chest", "Back", "Shoulders", "Arms", "Core"]

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreate = () => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: formData.name || "",
      category: formData.category || "Legs",
      difficulty: formData.difficulty || "Trung bình",
      equipment: formData.equipment || "",
      muscles: formData.muscles || [],
      description: formData.description || "",
      instructions: formData.instructions || [],
      tips: formData.tips || [],
      videoUrl: formData.videoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setExercises([...exercises, newExercise])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedExercise) return
    setExercises(
      exercises.map((ex) =>
        ex.id === selectedExercise.id
          ? { ...selectedExercise, ...formData, updatedAt: new Date() }
          : ex
      )
    )
    setIsEditOpen(false)
    setSelectedExercise(null)
    resetForm()
  }

  const handleDelete = (id: number | string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const openEditDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setFormData(exercise)
    setIsEditOpen(true)
  }

  const openPreviewDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsPreviewOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Legs",
      difficulty: "Trung bình",
      equipment: "",
      muscles: [],
      description: "",
      instructions: [],
      tips: [],
      videoUrl: "",
    })
  }

  const ExerciseForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên bài tập</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="VD: Squat"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Nhóm cơ</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.filter((c) => c !== "All").map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Độ khó</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dễ">Dễ</SelectItem>
              <SelectItem value="Trung bình">Trung bình</SelectItem>
              <SelectItem value="Khó">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Dụng cụ</Label>
        <Input
          id="equipment"
          value={formData.equipment}
          onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
          placeholder="VD: Barbell, Dumbbell"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="muscles">Nhóm cơ tác động (phân cách bằng dấu phẩy)</Label>
        <Input
          id="muscles"
          value={formData.muscles?.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              muscles: e.target.value.split(",").map((m) => m.trim()),
            })
          }
          placeholder="VD: Quadriceps, Glutes, Hamstrings"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mô tả ngắn gọn về bài tập"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Hướng dẫn thực hiện (mỗi bước một dòng)</Label>
        <Textarea
          id="instructions"
          value={formData.instructions?.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              instructions: e.target.value.split("\n").filter((i) => i.trim()),
            })
          }
          placeholder="Bước 1: ..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tips">Lưu ý quan trọng (mỗi lưu ý một dòng)</Label>
        <Textarea
          id="tips"
          value={formData.tips?.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              tips: e.target.value.split("\n").filter((t) => t.trim()),
            })
          }
          placeholder="Lưu ý về kỹ thuật..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl" className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          URL Video hướng dẫn (YouTube, Vimeo, etc.)
        </Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
        />
        <p className="text-xs text-muted-foreground">
          Sử dụng URL embed của YouTube (nhấn Share → Embed → copy src URL)
        </p>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit}>{submitText}</Button>
      </DialogFooter>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bài tập</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm bài tập mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm bài tập mới</DialogTitle>
              <DialogDescription>Tạo bài tập mới với video hướng dẫn chi tiết</DialogDescription>
            </DialogHeader>
            <ExerciseForm onSubmit={handleCreate} submitText="Tạo bài tập" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
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
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
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
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{exercise.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Nhóm cơ:</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles.slice(0, 3).map((muscle) => (
                        <Badge key={muscle} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.muscles.length > 3 && <Badge variant="secondary">+{exercise.muscles.length - 3}</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Dụng cụ: {exercise.equipment}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openPreviewDialog(exercise)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(exercise)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(exercise.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài tập</DialogTitle>
            <DialogDescription>Cập nhật thông tin và video hướng dẫn</DialogDescription>
          </DialogHeader>
          <ExerciseForm onSubmit={handleEdit} submitText="Lưu thay đổi" />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedExercise?.name}
              <Badge variant="outline">{selectedExercise?.category}</Badge>
              <Badge>{selectedExercise?.difficulty}</Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-6">
              {selectedExercise.videoUrl && (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={selectedExercise.videoUrl}
                    title={selectedExercise.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div>
                <p className="text-muted-foreground leading-relaxed">{selectedExercise.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Các bước thực hiện:</h3>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((step, index) => (
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
                <h3 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">Lưu ý quan trọng:</h3>
                <ul className="space-y-1">
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2" />
                      <span className="leading-relaxed text-orange-900 dark:text-orange-100">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Nhóm cơ:</strong> {selectedExercise.muscles.join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Dụng cụ:</strong> {selectedExercise.equipment}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Độ khó:</strong> {selectedExercise.difficulty}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
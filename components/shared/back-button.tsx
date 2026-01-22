"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  fallbackHref?: string
}

export function BackButton({ fallbackHref = "/" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(fallbackHref)
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Quay lại">
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}

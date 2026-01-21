export type PackageType = "session" | "duration"

export interface Package {
  id: string
  name: string
  type: PackageType
  price: number
  // For session packages
  totalSessions?: number
  usedSessions?: number
  // For duration packages
  durationMonths?: number
  startDate?: string
  endDate?: string
  // Common
  description: string
  features: string[]
}

export interface UserPackage {
  userId: number
  package: Package
  purchaseDate: string
  status: "active" | "expired" | "used_up"
}

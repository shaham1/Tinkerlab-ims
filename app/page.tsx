"use client"

import { useState } from "react"
import { StudentPanel } from "@/components/student-panel"
import { InventoryPanel } from "@/components/inventory-panel"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

export default function Home() {
  const [action, setAction] = useState<"borrow" | "return" | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [items, setItems] = useState<InventoryItem[]>([])

  const handleActionComplete = () => {
    setError(null)
    setAction(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleItemsLoaded = (loadedItems: InventoryItem[]) => {
    setItems(loadedItems)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-screen">
        <StudentPanel
          action={action}
          setAction={setAction}
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          isLoading={isLoading}
          error={error}
          refreshTrigger={refreshTrigger}
          items={items}
        />
        <InventoryPanel
          action={action}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          studentName={studentName}
          studentId={studentId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          onActionComplete={handleActionComplete}
          onItemsLoaded={handleItemsLoaded}
        />
      </div>
    </main>
  )
}

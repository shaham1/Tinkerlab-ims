"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface BorrowedItem {
  name: string
  borrowed: number
}

interface BorrowedItemsProps {
  studentId: string
  refreshTrigger: number
}

export function BorrowedItems({ studentId, refreshTrigger }: BorrowedItemsProps) {
  const [borrowedItems, setBorrowedItems] = useState<BorrowedItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!studentId) {
      setBorrowedItems([])
      return
    }

    const fetchBorrowedItems = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/borrowed?student_id=${studentId}`)
        if (!response.ok) throw new Error("Failed to fetch borrowed items")
        const data = await response.json()
        setBorrowedItems(data)
      } catch (err) {
        console.error(err)
        setBorrowedItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowedItems()
  }, [studentId, refreshTrigger])

  if (!studentId) {
    return (
      <Card className="p-6 bg-background border border-border">
        <p className="text-sm text-muted-foreground">Enter a student ID to view borrowed items</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6 bg-background border border-border">
        <p className="text-sm text-muted-foreground">Loading borrowed items...</p>
      </Card>
    )
  }

  if (borrowedItems.length === 0) {
    return (
      <Card className="p-6 bg-background border border-border">
        <p className="text-sm text-muted-foreground">No items currently borrowed</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-background border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Currently Borrowed</h3>
      <div className="space-y-3">
        {borrowedItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
          >
            <div>
              <p className="font-medium text-card-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.borrowed} unit(s)</p>
            </div>
            <div className="text-2xl font-bold text-primary">{item.borrowed}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

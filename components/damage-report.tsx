"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface DamageReportProps {
  studentName: string
  studentId: string
  items: Array<{ id: number; name: string; price: number }>
}

export function DamageReport({ studentName, studentId, items }: DamageReportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const selectedItemData = items.find((item) => String(item.id) === selectedItem)
  const totalAmount = selectedItemData ? selectedItemData.price * quantity : 0

  const handleSubmit = async () => {
    if (!selectedItem || !studentName || !studentId) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/damage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          item_name: selectedItemData?.name,
          quantity,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Damage report submitted successfully" })
        setSelectedItem("")
        setQuantity(1)
        setTimeout(() => {
          setIsOpen(false)
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.message || "Failed to submit damage report" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to submit damage report" })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        disabled={!studentName || !studentId}
        className="w-full"
      >
        Report Damage
      </Button>
    )
  }

  return (
    <Card className="p-6 bg-background border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Report Damaged Item</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md bg-card text-card-foreground"
          >
            <option value="">Select an item</option>
            {items.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name} ({item.price.toFixed(2)}) // HIHIHIHIHIHI
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Quantity Damaged</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            disabled={isLoading}
          />
        </div>

        {selectedItemData && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-card-foreground">
              <span className="font-semibold">Total Amount:</span> {totalAmount.toFixed(2)} //hihihihi
            </p>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-700"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!selectedItem || isLoading} className="flex-1">
            {isLoading ? "Submitting..." : "Submit Report"}
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" disabled={isLoading} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}

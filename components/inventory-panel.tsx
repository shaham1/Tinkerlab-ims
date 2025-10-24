"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface InventoryPanelProps {
  action: "borrow" | "return" | null
  selectedItem: string | null
  setSelectedItem: (id: string | null) => void
  selectedQuantity: number
  setSelectedQuantity: (qty: number) => void
  studentName: string
  studentId: string
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  onActionComplete: () => void
  onItemsLoaded: (items: InventoryItem[]) => void
}

export function InventoryPanel({
  action,
  selectedItem,
  setSelectedItem,
  selectedQuantity,
  setSelectedQuantity,
  studentName,
  studentId,
  isLoading,
  setIsLoading,
  setError,
  onActionComplete,
  onItemsLoaded,
}: InventoryPanelProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items")
        if (!response.ok) throw new Error("Failed to fetch items")
        const data = await response.json()
        setItems(data)
        onItemsLoaded(data)
      } catch (err) {
        setError("Failed to load inventory")
        console.error(err)
      } finally {
        setItemsLoading(false)
      }
    }

    fetchItems()
  }, [setError, onItemsLoaded])

  const currentItem = items.find((item) => item.id === Number(selectedItem))

  const handleConfirmAction = async () => {
    if (!currentItem || !action || !studentName || !studentId) return

    setIsLoading(true)
    setError(null)

    try {
      const endpoint = action === "borrow" ? "/api/borrow" : "/api/return"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: currentItem.name,
          student_id: studentId,
          student_name: studentName,
          quantity: selectedQuantity,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || `Failed to ${action} item`)
        return
      }

      const itemsResponse = await fetch("/api/items")
      if (itemsResponse.ok) {
        const updatedItems = await itemsResponse.json()
        setItems(updatedItems)
        onItemsLoaded(updatedItems)
      }

      setExpandedItem(null)
      setSelectedItem(null)
      setSelectedQuantity(1)
      onActionComplete()
    } catch (err) {
      setError(`Failed to ${action} item`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (itemsLoading) {
    return (
      <div className="w-2/3 bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading inventory...</p>
      </div>
    )
  }

  return (
    <div className="w-2/3 bg-background p-8 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Inventory</h2>
        <p className="text-muted-foreground">{items.length} items available</p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setExpandedItem(expandedItem === String(item.id) ? null : String(item.id))}
              disabled={!action || isLoading}
              className="w-full"
            >
              <Card
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedItem === String(item.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Available: {item.quantity} units</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">{item.quantity}</div>
                </div>
              </Card>
            </button>

            {expandedItem === String(item.id) && (
              <Card className="mt-2 p-4 bg-card border border-border">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Quantity to {action === "borrow" ? "Borrow" : "Return"}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={selectedItem === String(item.id) ? selectedQuantity : 1}
                        onChange={(e) => {
                          setSelectedItem(String(item.id))
                          setSelectedQuantity(
                            Math.min(Math.max(1, Number.parseInt(e.target.value) || 1), item.quantity),
                          )
                        }}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">/ {item.quantity}</span>
                    </div>
                  </div>

                  {selectedItem === String(item.id) && action && (
                    <Button className="w-full" onClick={handleConfirmAction} disabled={isLoading}>
                      {isLoading ? "Processing..." : `Confirm ${action === "borrow" ? "Borrow" : "Return"}`}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

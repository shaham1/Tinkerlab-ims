"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { BorrowedItems } from "./borrowed-items"
import { DamageReport } from "./damage-report"

interface StudentPanelProps {
  action: "borrow" | "return" | null
  setAction: (action: "borrow" | "return" | null) => void
  studentName: string
  setStudentName: (name: string) => void
  studentId: string
  setStudentId: (id: string) => void
  isLoading: boolean
  error: string | null
  refreshTrigger: number
  items: Array<{ id: number; name: string; price: number }>
}

export function StudentPanel({
  action,
  setAction,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  isLoading,
  error,
  refreshTrigger,
  items,
}: StudentPanelProps) {
  const isFormValid = studentName.trim() && studentId.trim()

  return (
    <div className="w-1/3 bg-card border-r border-border p-8 flex flex-col gap-8 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground mb-2">TinkerLab Inventory</h1>
      </div>

      <Card className="p-6 bg-background border border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Student Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Student Name</label>
            <Input
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Student ID</label>
            <Input
              placeholder="Enter student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-background border border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Action</h2>
        <div className="space-y-3">
          <Button
            onClick={() => setAction("borrow")}
            variant={action === "borrow" ? "default" : "outline"}
            disabled={!isFormValid || isLoading}
            className="w-full"
          >
            Borrow Item
          </Button>
          <Button
            onClick={() => setAction("return")}
            variant={action === "return" ? "default" : "outline"}
            disabled={!isFormValid || isLoading}
            className="w-full"
          >
            Return Item
          </Button>
        </div>
      </Card>

      {action && (
        <Card className="p-4 bg-primary/10 border border-primary/20">
          <p className="text-sm text-card-foreground">
            <span className="font-semibold">Mode:</span> {action === "borrow" ? "Borrowing" : "Returning"} items
          </p>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {isLoading && (
        <Card className="p-4 bg-primary/10 border border-primary/20">
          <p className="text-sm text-card-foreground">Processing...</p>
        </Card>
      )}

      <BorrowedItems studentId={studentId} refreshTrigger={refreshTrigger} />

      <DamageReport studentName={studentName} studentId={studentId} items={items} />
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { borrowItem } from "@/lib/inventory-actions"

export async function POST(request: NextRequest) {
  try {
    const { item_name, student_id, student_name, quantity } = await request.json()
    const result = await borrowItem(item_name, student_id, student_name, quantity)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to borrow item" }, { status: 500 })
  }
}

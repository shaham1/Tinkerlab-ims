import { type NextRequest, NextResponse } from "next/server"
import { getBorrowedItems } from "@/lib/inventory-actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const student_id = searchParams.get("student_id") || undefined
    const items = await getBorrowedItems(student_id)
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch borrowed items" }, { status: 500 })
  }
}

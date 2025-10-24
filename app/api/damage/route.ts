import { type NextRequest, NextResponse } from "next/server"
import { addDamageReport } from "@/lib/inventory-actions"

export async function POST(request: NextRequest) {
  try {
    const { student_id, student_name, item_name, quantity } = await request.json()
    const result = await addDamageReport(student_id, student_name, item_name, quantity)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add damage report" }, { status: 500 })
  }
}

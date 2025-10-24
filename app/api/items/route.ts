import { type NextRequest, NextResponse } from "next/server"
import { getItems, addItem } from "@/lib/inventory-actions"

export async function GET() {
  try {
    console.log("Fetching items from Supabase...")
    const items = await getItems()
    console.log("Items fetched successfully:", items)
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to fetch items", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, quantity, available, price } = await request.json()
    const item = await addItem(name, quantity, available, price)
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error adding item:", error)
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
  }
}

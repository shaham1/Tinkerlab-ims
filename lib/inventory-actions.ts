import { supabase } from "./supabase"

export async function addItem(name: string, quantity: number, available: boolean, price: number) {
  const { data, error } = await supabase.from("items").insert([{ name, quantity, available, price }]).select()

  if (error) throw error
  return data?.[0]
}

export async function getItems() {
  const { data, error } = await supabase.from("items").select("id, name, quantity, price").eq("available", true)

  if (error) throw error
  return data || []
}

export async function borrowItem(item_name: string, student_id: string, student_name: string, quantity = 1) {
  try {
    // Get the item
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id, quantity")
      .eq("name", item_name)
      .single()

    if (itemError || !item || item.quantity < quantity) {
      return { success: false, message: "Not enough items available" }
    }

    // Update quantity and create transaction in a transaction-like manner
    const { error: updateError } = await supabase
      .from("items")
      .update({ quantity: item.quantity - quantity })
      .eq("id", item.id)

    if (updateError) throw updateError

    const { error: txError } = await supabase
      .from("transactions")
      .insert([{ student_id, student_name, type: "borrow", quantity, item_name }])

    if (txError) throw txError

    return { success: true, message: "Item borrowed successfully" }
  } catch (error) {
    return { success: false, message: "Failed to borrow item" }
  }
}

export async function returnItem(item_name: string, student_id: string, student_name: string, quantity = 1) {
  try {
    // Get all transactions for this student and item
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("type, quantity")
      .eq("student_id", student_id)
      .eq("item_name", item_name)

    if (txError) throw txError

    // Calculate borrowed amount
    let borrowSum = 0
    let returnSum = 0

    transactions?.forEach((tx) => {
      if (tx.type === "borrow") borrowSum += tx.quantity
      if (tx.type === "return") returnSum += tx.quantity
    })

    const borrowed = borrowSum - returnSum

    if (quantity > borrowed) {
      return {
        success: false,
        message: `Cannot return ${quantity}. Only ${borrowed} currently borrowed.`,
      }
    }

    // Get the item
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id, quantity")
      .eq("name", item_name)
      .single()

    if (itemError || !item) {
      return { success: false, message: "Item not found" }
    }

    // Update quantity and create transaction
    const { error: updateError } = await supabase
      .from("items")
      .update({ quantity: item.quantity + quantity })
      .eq("id", item.id)

    if (updateError) throw updateError

    const { error: createTxError } = await supabase
      .from("transactions")
      .insert([{ student_id, student_name, type: "return", quantity, item_name }])

    if (createTxError) throw createTxError

    return { success: true, message: "Item returned successfully" }
  } catch (error) {
    return { success: false, message: "Failed to return item" }
  }
}

export async function addDamageReport(student_id: string, student_name: string, item_name: string, quantity: number) {
  try {
    const { data: item, error: itemError } = await supabase.from("items").select("price").eq("name", item_name).single()

    if (itemError || !item) {
      return { success: false, message: "Item not found" }
    }

    const amount = Number(item.price) * quantity

    const { error } = await supabase
      .from("damages")
      .insert([{ student_id, student_name, item: item_name, quantity, amount }])

    if (error) throw error

    return { success: true, message: "Damage report added successfully" }
  } catch (error) {
    return { success: false, message: "Failed to add damage report" }
  }
}

export async function getBorrowedItems(student_id?: string) {
  try {
    const query = supabase.from("transactions").select("item_name, type, quantity")

    if (student_id) {
      query.eq("student_id", student_id)
    }

    const { data: transactions, error } = await query

    if (error) throw error

    const borrowedMap: Record<string, number> = {}

    transactions?.forEach((tx) => {
      if (!borrowedMap[tx.item_name]) borrowedMap[tx.item_name] = 0
      if (tx.type === "borrow") borrowedMap[tx.item_name] += tx.quantity
      if (tx.type === "return") borrowedMap[tx.item_name] -= tx.quantity
    })

    return Object.entries(borrowedMap)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => ({ name, borrowed: qty }))
  } catch (error) {
    return []
  }
}

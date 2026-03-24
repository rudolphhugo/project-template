import { NextResponse } from 'next/server'
import { getAllItems, addItem } from '@/lib/server-store'
import type { Item } from '@/lib/keyturn-store'

export async function GET() {
  return NextResponse.json(getAllItems())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, icon } = body as { name: string; icon: string }
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const tagId = `kt-${Date.now().toString(36)}`
  const item: Item = { id: tagId, name: name.trim(), icon: icon || '🔑', tagId }
  addItem(item)
  return NextResponse.json(item, { status: 201 })
}

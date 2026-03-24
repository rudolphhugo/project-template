import { NextRequest, NextResponse } from 'next/server'
import {
  getServerTagState,
  setServerTagState,
  resetServerTagState,
} from '@/lib/server-store'
import type { Message, RewardChoice } from '@/lib/keyturn-store'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  return NextResponse.json(getServerTagState(id))
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const state = getServerTagState(id)

  if (body.type === 'message') {
    const msg: Message = {
      id: crypto.randomUUID(),
      from: body.from,
      text: body.text,
      time: Date.now(),
    }
    setServerTagState(id, {
      ...state,
      found: true,
      messages: [...state.messages, msg],
    })
  } else if (body.type === 'location') {
    setServerTagState(id, {
      ...state,
      found: true,
      locationShared: { lat: body.lat, lng: body.lng },
    })
  } else if (body.type === 'set-reward') {
    setServerTagState(id, {
      ...state,
      reward: { amount: body.amount, currency: body.currency ?? 'kr' },
    })
  } else if (body.type === 'reward-choice') {
    const choice: RewardChoice = { type: body.choice, charity: body.charity }
    const systemMsg: Message = {
      id: crypto.randomUUID(),
      from: 'system',
      text:
        choice.type === 'code'
          ? '🎁 The finder would like a gift card code as their reward.'
          : `💚 The finder would like you to donate the reward to ${body.charity}.`,
      time: Date.now(),
    }
    setServerTagState(id, {
      ...state,
      rewardChoice: choice,
      messages: [...state.messages, systemMsg],
    })
  }

  return NextResponse.json(getServerTagState(id))
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  resetServerTagState(id)
  return NextResponse.json({ ok: true })
}

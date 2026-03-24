'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  Key,
  Shield,
  MapPin,
  Send,
  Store,
  Building2,
  Users,
  MailOpen,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Gift,
  Heart,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { TagState, Message } from '@/lib/keyturn-store'

const QUICK_ACTIONS = [
  { icon: Store, text: 'Left them at the nearest store counter' },
  { icon: Building2, text: 'Dropped them at the police station' },
  { icon: Users, text: 'Can we arrange a safe handoff?' },
  { icon: MailOpen, text: 'Put them in a nearby mailbox' },
]

const CHARITIES = [
  { name: 'Red Cross', emoji: '🔴' },
  { name: 'UNICEF', emoji: '🌊' },
  { name: 'WWF', emoji: '🌿' },
]

export default function ScanPage() {
  const params = useParams()
  const tagId = params.id as string

  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [tagState, setTagState] = useState<TagState>({
    found: false, locationShared: null, messages: [], reward: null, rewardChoice: null,
  })
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showCharities, setShowCharities] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = tagState.messages
  const hasSent = messages.some((m) => m.from === 'finder')
  const locationShared = !!tagState.locationShared

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/tag/${tagId}`)
      const state: TagState = await res.json()
      setTagState(state)
    }
    poll()
    const interval = setInterval(poll, 2000)
    return () => clearInterval(interval)
  }, [tagId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-advance to reward step once finder has sent a message and reward is set
  useEffect(() => {
    if (hasSent && tagState.reward && step === 1 && !tagState.rewardChoice) {
      // Small delay so the finder sees their message land first
      const t = setTimeout(() => setStep(2), 1200)
      return () => clearTimeout(t)
    }
  }, [hasSent, tagState.reward, tagState.rewardChoice, step])

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return
    setSending(true)
    setInput('')
    await fetch(`/api/tag/${tagId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', from: 'finder', text: text.trim() }),
    })
    const res = await fetch(`/api/tag/${tagId}`)
    setTagState(await res.json())
    setSending(false)
  }

  const shareLocation = () => {
    const post = (lat: number, lng: number) => {
      fetch(`/api/tag/${tagId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'location', lat, lng }),
      })
      setTagState((s) => ({ ...s, locationShared: { lat, lng } }))
    }
    if (!navigator.geolocation) { post(59.3293, 18.0686); return }
    navigator.geolocation.getCurrentPosition(
      (p) => post(p.coords.latitude, p.coords.longitude),
      () => post(59.3293, 18.0686),
    )
  }

  const chooseReward = async (type: 'code' | 'charity', charity?: string) => {
    await fetch(`/api/tag/${tagId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'reward-choice', choice: type, charity }),
    })
    const res = await fetch(`/api/tag/${tagId}`)
    setTagState(await res.json())
  }

  // ── STEP 0: Greeting ────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
        <div className="max-w-md mx-auto px-6 w-full flex flex-col flex-1 py-10">
          <div className="flex items-center gap-2 mb-auto">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Key className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Key-turn</span>
          </div>

          <div className="flex flex-col items-center text-center py-10">
            <div className="text-7xl mb-6 select-none">🙏</div>
            <h1 className="text-white text-3xl font-bold tracking-tight mb-3 leading-tight">
              You found<br />my keys!
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              I lost them nearby. You can help me get them back — quickly and completely anonymously.
            </p>

            {/* Reward badge */}
            {tagState.reward && (
              <div className="mt-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300 text-sm font-semibold">
                    {tagState.reward.amount} {tagState.reward.currency} reward if returned
                  </span>
                </div>
                <p className="text-amber-400/60 text-xs">
                  You choose: gift card code or charity donation
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            {['No account', 'No identity', 'No trace'].map((label) => (
              <div key={label} className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="text-indigo-300 text-xs">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="flex items-center justify-center gap-3 w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 rounded-2xl py-4 text-white font-semibold text-base transition-colors cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            Help return these keys
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-slate-600 text-xs text-center mt-4">
            The owner will never see your name or contact details
          </p>
        </div>
      </main>
    )
  }

  // ── STEP 2: Reward Choice ───────────────────────────────────────────────
  if (step === 2 && tagState.reward && !tagState.rewardChoice) {
    const { amount, currency } = tagState.reward
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
        <div className="max-w-md mx-auto px-6 w-full flex flex-col flex-1 py-10">
          <div className="flex items-center gap-2 mb-auto">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Key className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Key-turn</span>
          </div>

          <div className="flex flex-col items-center text-center py-8">
            <div className="text-6xl mb-5 select-none">🎉</div>
            <h2 className="text-white text-2xl font-bold tracking-tight mb-2">
              You&apos;ve done a good deed
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The owner is offering{' '}
              <span className="text-amber-300 font-semibold">
                {amount} {currency}
              </span>{' '}
              as a thank-you. How would you like to receive it?
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {/* Option B — Gift card */}
            {!showCharities && (
              <button
                onClick={() => chooseReward('code')}
                className="flex items-start gap-4 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 rounded-2xl px-5 py-4 text-left transition-colors cursor-pointer w-full"
              >
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Gift card code</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    The owner will send you a digital gift card code via chat
                  </p>
                </div>
              </button>
            )}

            {/* Option C — Pay it forward */}
            {!showCharities ? (
              <button
                onClick={() => setShowCharities(true)}
                className="flex items-start gap-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl px-5 py-4 text-left transition-colors cursor-pointer w-full"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Pay it forward</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Ask the owner to donate {amount} {currency} to a charity in your name
                  </p>
                </div>
              </button>
            ) : (
              /* Charity picker */
              <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <p className="text-emerald-300 text-sm font-medium">Choose a charity</p>
                </div>
                <div className="flex flex-col gap-2">
                  {CHARITIES.map(({ name, emoji }) => (
                    <button
                      key={name}
                      onClick={() => chooseReward('charity', name)}
                      className="flex items-center gap-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer w-full"
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-slate-200 text-sm font-medium">{name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCharities(false)}
                  className="mt-3 text-slate-500 text-xs underline underline-offset-2 cursor-pointer"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ── STEP 2 complete: reward choice made ─────────────────────────────────
  if (step === 2 && tagState.rewardChoice) {
    const { type, charity } = tagState.rewardChoice
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
        <div className="max-w-md mx-auto px-6 w-full flex flex-col flex-1 py-10 items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-5">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">All done — thank you!</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            {type === 'code'
              ? 'The owner has been notified to send you a gift card code via chat.'
              : `The owner has been asked to donate to ${charity} in your name.`}
          </p>
          <div className="mt-6 flex items-center gap-2 text-slate-600 text-xs">
            <Shield className="w-3 h-3" />
            <span>Your identity was never revealed</span>
          </div>
        </div>
      </main>
    )
  }

  // ── STEP 1: Actions + Chat ───────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Key className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight text-sm">Key-turn</span>
        </div>

        <div className="mb-5">
          <h2 className="text-white text-lg font-bold mb-1">How would you like to help?</h2>
          <p className="text-slate-400 text-sm">Choose a quick reply or write your own message.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2 mb-5">
          {QUICK_ACTIONS.map(({ icon: Icon, text }) => (
            <button
              key={text}
              onClick={() => sendMessage(text)}
              disabled={sending}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-xl px-4 py-3.5 text-left transition-colors cursor-pointer w-full disabled:opacity-50"
            >
              <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-200 text-sm">{text}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-slate-500 text-xs">or write a message</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.from === 'system'
                    ? 'mx-auto bg-white/5 border border-white/10 text-slate-400 text-xs text-center rounded-xl'
                    : msg.from === 'finder'
                      ? 'ml-auto bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-br-sm'
                      : 'mr-auto bg-white/10 border border-white/10 text-slate-200 rounded-bl-sm',
                )}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 rounded-xl h-12"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className="bg-indigo-500 hover:bg-indigo-400 text-white h-12 w-12 p-0 rounded-xl shrink-0 cursor-pointer disabled:opacity-40"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {/* Location Share */}
        {!locationShared ? (
          <button
            onClick={shareLocation}
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-slate-300 text-sm transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Share my current location
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Location shared with owner
          </div>
        )}

        {hasSent && tagState.reward && (
          <p className="text-center text-amber-400/60 text-xs mt-4">
            🎁 A reward is waiting — keep an eye on this chat
          </p>
        )}
      </div>
    </main>
  )
}

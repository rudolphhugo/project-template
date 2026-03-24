'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Key,
  Bell,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Send,
  CheckCircle,
  Shield,
  BellRing,
  Loader2,
  Gift,
  Plus,
  QrCode,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { TagState, Item } from '@/lib/keyturn-store'
import { QRBlock } from '@/components/qr-block'

const TAG_ID = 'abc123'

const ICON_OPTIONS = ['🔑', '🪪', '🎒', '💼', '👜', '🚗', '🛴', '📱', '💻', '🎸', '🏠', '✈️']

export default function DashboardPage() {
  const [state, setState] = useState<TagState>({
    found: false, locationShared: null, messages: [], reward: null, rewardChoice: null,
  })
  const [items, setItems] = useState<Item[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [ownerInput, setOwnerInput] = useState('')
  const [sending, setSending] = useState(false)
  const [rewardInput, setRewardInput] = useState('')
  const [savingReward, setSavingReward] = useState(false)
  const [qrItem, setQrItem] = useState<Item | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🔑')
  const [adding, setAdding] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchItems = async () => {
    const res = await fetch('/api/items')
    setItems(await res.json())
  }

  useEffect(() => {
    fetchItems()
    const poll = async () => {
      const res = await fetch(`/api/tag/${TAG_ID}`)
      const data: TagState = await res.json()
      setState(data)
      if (data.reward) setRewardInput(String(data.reward.amount))
    }
    poll()
    const interval = setInterval(poll, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  const ownerSend = async () => {
    if (!ownerInput.trim() || sending) return
    setSending(true)
    const text = ownerInput.trim()
    setOwnerInput('')
    await fetch(`/api/tag/${TAG_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', from: 'owner', text }),
    })
    const res = await fetch(`/api/tag/${TAG_ID}`)
    setState(await res.json())
    setSending(false)
  }

  const saveReward = async () => {
    const amount = parseInt(rewardInput, 10)
    if (!amount || amount <= 0) return
    setSavingReward(true)
    await fetch(`/api/tag/${TAG_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'set-reward', amount, currency: 'kr' }),
    })
    const res = await fetch(`/api/tag/${TAG_ID}`)
    setState(await res.json())
    setSavingReward(false)
  }

  const markReturned = async () => {
    await fetch(`/api/tag/${TAG_ID}`, { method: 'DELETE' })
    setState({ found: false, locationShared: null, messages: [], reward: null, rewardChoice: null })
    setSelectedItemId(null)
  }

  const handleAddItem = async () => {
    if (!newName.trim() || adding) return
    setAdding(true)
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), icon: newIcon }),
    })
    await fetchItems()
    setNewName('')
    setNewIcon('🔑')
    setAdding(false)
    setAddOpen(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold tracking-tight text-sm leading-none">Key-turn</p>
              <p className="text-slate-500 text-xs mt-0.5">Owner Dashboard</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
              {state.found
                ? <BellRing className="w-4 h-4 text-amber-400" />
                : <Bell className="w-4 h-4 text-slate-400" />}
            </div>
            {state.found && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 animate-pulse" />
            )}
          </div>
        </div>

        {/* ── LIST VIEW ──────────────────────────────────────────── */}
        {!selectedItemId ? (
          <>
            {state.found && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-300 font-semibold text-sm">Someone found your Home Keys</p>
                    <p className="text-amber-400/70 text-xs mt-0.5">A finder reached out anonymously just now</p>
                    <button
                      onClick={() => setSelectedItemId('abc123')}
                      className="mt-2 text-xs text-amber-300 font-medium underline underline-offset-2 cursor-pointer"
                    >
                      View chat and location →
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">My Items</p>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add item
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {items.map((item) => {
                const isFound = item.tagId === TAG_ID && state.found
                return (
                  <button
                    key={item.id}
                    onClick={() => isFound && setSelectedItemId(item.id)}
                    className={cn(
                      'flex items-center gap-4 bg-white/5 border rounded-2xl px-4 py-4 text-left transition-colors w-full',
                      isFound
                        ? 'border-amber-500/30 hover:bg-amber-500/5 cursor-pointer'
                        : 'border-white/10 cursor-default',
                    )}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Tag ID: KT-{item.tagId.slice(0, 4).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setQrItem(item) }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      {isFound ? (
                        <>
                          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs animate-pulse">Found!</Badge>
                          <ChevronRight className="w-4 h-4 text-amber-400" />
                        </>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">Safe</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Reward Setting */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-amber-400" />
                <p className="text-white text-sm font-medium">Gift card or charity reward</p>
                {state.reward && (
                  <span className="ml-auto text-amber-300 text-xs font-medium">
                    {state.reward.amount} {state.reward.currency} set
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                Set an optional reward amount. The finder will choose to receive it as a gift card code or as a charity donation in their name.
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount (e.g. 200)"
                  value={rewardInput}
                  onChange={(e) => setRewardInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveReward()}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 rounded-xl h-10 text-sm"
                />
                <span className="flex items-center text-slate-400 text-sm px-1 shrink-0">kr</span>
                <Button
                  onClick={saveReward}
                  disabled={!rewardInput || savingReward}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white h-10 px-4 rounded-xl shrink-0 text-sm cursor-pointer disabled:opacity-40"
                >
                  {savingReward ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Set'}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto px-1">
              <Shield className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <p className="text-slate-600 text-xs">Your identity and address are never shared with finders</p>
            </div>
          </>
        ) : (
          /* ── CHAT VIEW ───────────────────────────────────────── */
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setSelectedItemId(null)}
                className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </button>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Home Keys</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-amber-400 text-xs">Found · Anonymous finder</p>
                  {state.reward && (
                    <span className="text-amber-300/60 text-xs">· 🎁 {state.reward.amount} {state.reward.currency} reward</span>
                  )}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4 shrink-0">
              <div className="h-36 relative flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="relative flex flex-col items-center gap-2">
                  {state.locationShared ? (
                    <>
                      <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-slate-900/90 rounded-lg px-3 py-1.5 border border-white/10">
                        <p className="text-slate-300 text-xs font-mono">
                          {state.locationShared.lat.toFixed(4)}°N, {state.locationShared.lng.toFixed(4)}°E
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs">No location shared yet</p>
                  )}
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-white/5">
                <p className="text-slate-500 text-xs">Finder&apos;s approximate location</p>
              </div>
            </div>

            {/* Reward choice notification */}
            {state.rewardChoice && (
              <div className={cn(
                'rounded-2xl px-4 py-3 mb-4 text-sm border',
                state.rewardChoice.type === 'code'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
              )}>
                {state.rewardChoice.type === 'code'
                  ? '🎁 Finder wants a gift card code — send one via the chat below'
                  : `💚 Finder asked you to donate to ${state.rewardChoice.charity}`}
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex flex-col gap-2 mb-4 overflow-y-auto max-h-56">
              {state.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm',
                    msg.from === 'system'
                      ? 'mx-auto max-w-[90%] bg-white/5 border border-white/10 text-slate-400 text-xs text-center rounded-xl'
                      : msg.from === 'owner'
                        ? 'ml-auto max-w-[80%] bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-br-sm'
                        : 'mr-auto max-w-[80%] bg-white/10 border border-white/10 text-slate-200 rounded-bl-sm',
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 mb-3 mt-auto">
              <Input
                placeholder="Reply to finder..."
                value={ownerInput}
                onChange={(e) => setOwnerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ownerSend()}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 rounded-xl h-12"
              />
              <Button
                onClick={ownerSend}
                disabled={!ownerInput.trim() || sending}
                className="bg-indigo-500 hover:bg-indigo-400 text-white h-12 w-12 p-0 rounded-xl shrink-0 cursor-pointer disabled:opacity-40"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            <button
              onClick={markReturned}
              className="flex items-center justify-center gap-2 w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl py-3 text-emerald-400 text-sm transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Returned
            </button>
          </div>
        )}
      </div>

      <Dialog open={!!qrItem} onOpenChange={(open) => !open && setQrItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-semibold flex items-center gap-2">
              <span>{qrItem?.icon}</span>
              <span>{qrItem?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 pt-1 pb-2">
            {qrItem && <QRBlock path={`/scan/${qrItem.tagId}`} />}
            <p className="text-slate-500 text-xs text-center">
              Print or show this code — finders scan it to contact you anonymously
            </p>
            <p className="text-slate-600 text-xs font-mono">KT-{qrItem?.tagId.slice(0, 4).toUpperCase()}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-semibold">Add new item</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-1">
            <div>
              <p className="text-slate-400 text-xs mb-2">Item name</p>
              <Input
                placeholder="e.g. Car Keys"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                autoFocus
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 rounded-xl h-10 text-sm"
              />
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-2">Icon</p>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewIcon(emoji)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-colors cursor-pointer',
                      newIcon === emoji
                        ? 'bg-indigo-500/30 ring-2 ring-indigo-500'
                        : 'bg-white/5 hover:bg-white/10',
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddItem}
              disabled={!newName.trim() || adding}
              className="bg-indigo-500 hover:bg-indigo-400 text-white h-10 rounded-xl text-sm cursor-pointer disabled:opacity-40"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add item'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

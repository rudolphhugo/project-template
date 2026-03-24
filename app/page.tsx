import Link from 'next/link'
import { Key, LayoutDashboard } from 'lucide-react'
import { QRBlock } from '@/components/qr-block'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Key-turn</h1>
          <p className="text-slate-500 text-sm mt-1">Anonymous lost &amp; found for your keys</p>
        </div>

        {/* QR Code */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-5 flex flex-col items-center gap-4">
          <p className="text-slate-300 text-sm font-medium">Scan to simulate a finder</p>
          <QRBlock path="/scan/abc123" />
          <div className="text-center">
            <p className="text-slate-500 text-xs">Points to your network URL</p>
            <p className="text-slate-600 text-xs mt-0.5">Works on any device on the same WiFi</p>
          </div>
        </div>

        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-5 py-4 transition-colors"
        >
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm">Owner&apos;s Dashboard</p>
            <p className="text-slate-500 text-xs">Open on your laptop to watch it update live</p>
          </div>
        </Link>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function QRBlock({ path }: { path: string }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`)
  }, [path])

  if (!url) return (
    <div className="w-[180px] h-[180px] bg-white/5 rounded-2xl animate-pulse" />
  )

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg shadow-black/40">
      <QRCodeSVG value={url} size={160} bgColor="#ffffff" fgColor="#0f172a" level="M" />
    </div>
  )
}

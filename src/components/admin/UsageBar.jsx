import { useEffect, useState } from 'react'
import { LIMITS } from '../../lib/config'
import { getUsedBytes } from '../../services/admin'
import { ProgressBar, formatBytes } from './ui'

export default function UsageBar({ version }) {
  const [used, setUsed] = useState(null)
  useEffect(() => {
    getUsedBytes().then(setUsed).catch(() => setUsed(null))
  }, [version])
  if (used === null) return null
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <ProgressBar value={used / LIMITS.storageBytes} label={`المساحة المستخدمة: ${formatBytes(used)} من ${formatBytes(LIMITS.storageBytes)}`} />
    </div>
  )
}

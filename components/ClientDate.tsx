'use client'

import { useEffect, useState } from 'react'

interface ClientDateProps {
  timestamp: string
}

export function ClientDate({ timestamp }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    // Format date only on client side to avoid hydration mismatch
    setFormattedDate(new Date(timestamp).toLocaleString())
  }, [timestamp])

  if (!formattedDate) {
    // Show a placeholder during hydration
    return <span>Loading...</span>
  }

  return <span>{formattedDate}</span>
}

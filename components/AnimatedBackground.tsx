'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BackgroundElement {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

export function AnimatedBackground() {
  const [elements, setElements] = useState<BackgroundElement[]>([])

  useEffect(() => {
    // Generate background elements only on client side
    const backgroundElements = [...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
    setElements(backgroundElements)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
          }}
        />
      ))}
    </div>
  )
}

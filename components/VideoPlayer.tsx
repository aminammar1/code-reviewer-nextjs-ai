    'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'

interface VideoPlayerProps {
  youtubeId?: string
  localVideoSrc?: string
  posterImage?: string
  title?: string
  description?: string
}

export function VideoPlayer({
  youtubeId,
  localVideoSrc,
  posterImage,
  title = 'Interactive Demo',
  description = "Click to see ReviewStack's 3-panel workspace in action",
}: VideoPlayerProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="glass p-2 rounded-2xl border border-white/20">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {!isVideoPlaying ? (
          /* Video placeholder with modern design */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 glass rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400">{description}</p>
            </div>

            {/* Simulated interface preview */}
            <div className="absolute inset-4 opacity-20">
              <div className="grid grid-cols-3 gap-2 h-full">
                <div className="glass rounded border border-white/10"></div>
                <div className="glass rounded border border-white/10"></div>
                <div className="glass rounded border border-white/10"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Video player */
          <div className="relative w-full h-full">
            {youtubeId ? (
              /* YouTube iframe */
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : localVideoSrc ? (
              /* Local video */
              <video
                className="w-full h-full object-cover rounded-xl"
                controls
                autoPlay
                poster={posterImage}
              >
                <source src={localVideoSrc} type="video/mp4" />
                <source
                  src={localVideoSrc.replace('.mp4', '.webm')}
                  type="video/webm"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              /* Fallback */
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Video not available</p>
              </div>
            )}

            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setIsVideoPlaying(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

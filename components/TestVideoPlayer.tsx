    'use client'

    import { useState } from 'react'
    import { motion } from 'framer-motion'
    import { Play, X, Sparkles } from 'lucide-react'
    import Image from 'next/image'

    export function TestVideoPlayer() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
        {/* Modern glass container with larger size */}        <div className="relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl">
            {/* Animated border glow - matching page theme */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-400/10 via-gray-300/10 to-gray-500/10 blur-xl opacity-50 animate-pulse"></div>
            
            {/* Main video container - much larger */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-inner">
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                    style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                    }}
                    transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    }}
                />
                ))}
            </div>          
            {!isVideoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                {/* Modern central play area */}
                <div className="text-center z-20 relative">
                    <motion.div
                    className="relative mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    >                    {/* Glowing ring around play button - matching theme */}
                    <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gray-400/20 via-gray-300/20 to-gray-500/20 blur-lg animate-pulse"></div>
                    
                    <motion.button
                        className="relative w-32 h-32 mx-auto bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer border border-white/30 shadow-2xl group"
                        onClick={() => setIsVideoPlaying(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Inner glow */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                        
                        <Play className="w-12 h-12 text-white ml-2 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
                        
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
                    </motion.button>
                    </motion.div>
                    
                    <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        Interactive Demo
                    </h3>
                    <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
                        Click to see ReviewStack&apos;s 3-panel workspace in action
                    </p>
                    
                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                        AI-Powered
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                        Real-time
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                        GitHub Integration
                        </span>
                    </div>
                    </motion.div>
                </div>
                
                {/* Enhanced background preview with modern grid */}
                <div className="absolute inset-8 opacity-15">
                    <div className="grid grid-cols-3 gap-4 h-full">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                        key={i}
                        className="bg-gradient-to-br from-white/20 to-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        >
                        {/* Simulated content lines */}
                        <div className="p-4 space-y-2">
                            <div className="h-2 bg-white/20 rounded w-3/4"></div>
                            <div className="h-2 bg-white/15 rounded w-1/2"></div>
                            <div className="h-2 bg-white/10 rounded w-2/3"></div>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                </div>
                {/* Show the poster image with modern overlay */}
                <Image 
                    src="/video-poster.png" 
                    alt="Video poster"
                    fill
                    className="object-cover rounded-2xl opacity-25"
                    onError={(e) => {
                    console.log('Poster image failed to load:', e)
                    e.currentTarget.style.display = 'none'
                    }}
                    onLoad={() => console.log('Poster image loaded successfully')}
                />
                </div>          ) : (
                <div className="relative w-full h-full">
                <video
                    className="w-full h-full object-cover rounded-2xl"
                    controls
                    autoPlay
                    poster="/video-poster.png"
                    onError={(e) => console.log('Video failed to load:', e)}
                    onLoadStart={() => console.log('Video started loading')}
                    onCanPlay={() => console.log('Video can play')}
                >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Modern close button */}
                <motion.button
                    className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 shadow-xl"
                    onClick={() => setIsVideoPlaying(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <X className="w-6 h-6 text-white" />
                </motion.button>
                </div>
            )}
            </div>
              {/* Modern bottom info bar */}
            <div className="mt-6 flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live Demo Available</span>
                </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>HD Quality</span>
            </div>
            </div>
        </div>
        </div>
    )
    }

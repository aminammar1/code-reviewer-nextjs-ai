'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ArrowLeft, Code } from 'lucide-react'
import Link from 'next/link'

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  )

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-2xl border border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ReviewStack</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Sign In Options */}
          <div className="space-y-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <motion.button
                  key={provider.name}
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: '/workspace' })
                  }
                  className="w-full bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {provider.name === 'GitHub' && <Github className="w-5 h-5" />}
                  <span>Continue with {provider.name}</span>
                </motion.button>
              ))}
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Guest Access */}
          <Link
            href="/workspace"
            className="w-full glass glass-hover px-6 py-3 rounded-lg text-white transition-all duration-300 font-semibold flex items-center justify-center space-x-2 border border-white/20"
          >
            <span>Continue as Guest</span>
          </Link>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-white hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-white hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}

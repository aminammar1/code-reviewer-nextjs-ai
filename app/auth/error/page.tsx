'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Code, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'Unable to sign in. Please try again.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-2xl border border-white/10 text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ReviewStack</span>
            </div>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-400">{errorMessage}</p>
          </div>
          {/* Error Details */}
          {error !== 'Default' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm font-mono">Error: {error}</p>
            </div>
          )}{' '}
          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </Link>

            <Link
              href="/workspace"
              className="w-full glass glass-hover px-6 py-3 rounded-lg text-white transition-all duration-300 font-semibold flex items-center justify-center space-x-2 border border-white/20"
            >
              <span>Continue as Guest</span>
            </Link>
          </div>
          {/* Back to Home */}
          <div className="mt-6">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>

        {/* Support */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Still having trouble?{' '}
          <Link href="/contact" className="text-white hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}

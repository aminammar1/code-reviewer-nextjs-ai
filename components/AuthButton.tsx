'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Github, LogOut } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AuthButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function AuthButton({
  className,
  variant = 'primary',
}: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <button
        disabled
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 opacity-50',
          variant === 'primary' && 'bg-white text-black',
          variant === 'secondary' &&
            'bg-white/10 text-white border border-white/20',
          variant === 'ghost' && 'text-white hover:bg-white/10',
          className
        )}
      >
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Loading...
      </button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {' '}
        <div className="flex items-center gap-2 text-white">
          <Image
            src={session.user?.image || ''}
            alt={session.user?.name || ''}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <span className="text-sm font-medium">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105',
            variant === 'primary' && 'bg-red-500 hover:bg-red-600 text-white',
            variant === 'secondary' &&
              'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40',
            variant === 'ghost' && 'text-white hover:bg-white/10',
            className
          )}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('github')}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105',
        variant === 'primary' &&
          'bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl',
        variant === 'secondary' &&
          'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40',
        variant === 'ghost' && 'text-white hover:bg-white/10',
        className
      )}
    >
      <Github className="w-4 h-4" />
      Sign in with GitHub
    </button>
  )
}

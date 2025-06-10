'use client'

import { useState, useEffect, useCallback } from 'react'
import { GitHubService } from '@/services/github'
import { GitHubRepository, GitHubFile } from '@/types'
import { Folder, File, ChevronRight, Home, RefreshCw } from 'lucide-react'
import { cn, getFileExtension } from '@/lib/utils'

interface RepositoryBrowserProps {
  repository: GitHubRepository | null
  currentPath: string
  onFileSelect: (file: GitHubFile) => void
  onPathChange: (path: string) => void
  githubService: GitHubService
}

export function RepositoryBrowser({
  repository,
  currentPath,
  onFileSelect,
  onPathChange,
  githubService,
}: RepositoryBrowserProps) {
  const [files, setFiles] = useState<GitHubFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFiles = useCallback(
    async (path: string) => {
      if (!repository) return

      setIsLoading(true)
      setError(null)

      try {
        const [owner, repo] = repository.full_name.split('/')
        const contents = await githubService.getRepositoryContents(
          owner,
          repo,
          path
        )

        // Sort: directories first, then files, both alphabetically
        const sorted = contents.sort((a, b) => {
          if (a.type === 'dir' && b.type === 'file') return -1
          if (a.type === 'file' && b.type === 'dir') return 1
          return a.name.localeCompare(b.name)
        })

        setFiles(sorted)
      } catch {
        setError('Failed to load repository contents')
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    },
    [repository, githubService]
  )

  useEffect(() => {
    if (repository) {
      loadFiles(currentPath)
    }
  }, [repository, currentPath, loadFiles])

  const handleItemClick = (file: GitHubFile) => {
    if (file.type === 'dir') {
      onPathChange(file.path)
    } else {
      onFileSelect(file)
    }
  }

  const navigateToPath = (targetPath: string) => {
    onPathChange(targetPath)
  }

  const getFileIcon = (file: GitHubFile) => {
    if (file.type === 'dir') {
      return <Folder className="w-4 h-4 text-blue-400" />
    }

    const extension = getFileExtension(file.name)
    const iconMap: Record<string, string> = {
      js: 'text-yellow-400',
      jsx: 'text-yellow-400',
      ts: 'text-blue-400',
      tsx: 'text-blue-400',
      py: 'text-green-400',
      java: 'text-orange-400',
      html: 'text-orange-400',
      css: 'text-blue-400',
      json: 'text-yellow-400',
      md: 'text-gray-400',
    }

    const colorClass = iconMap[extension] || 'text-gray-400'
    return <File className={cn('w-4 h-4', colorClass)} />
  }

  const breadcrumbs = currentPath.split('/').filter(Boolean)

  if (!repository) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">
            Repository Browser
          </h3>
          <p className="text-white/60 text-sm">
            Select a repository to browse files
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/40">
            <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No repository selected</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Files</h3>
          <button
            onClick={() => loadFiles(currentPath)}
            className="glass-hover p-1 rounded transition-colors"
            disabled={isLoading}
          >
            <RefreshCw
              className={cn(
                'w-4 h-4 text-white/60',
                isLoading && 'animate-spin'
              )}
            />
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1 text-sm">
          <button
            onClick={() => navigateToPath('')}
            className="text-white/60 hover:text-white transition-colors flex items-center space-x-1"
          >
            <Home className="w-3 h-3" />
            <span>{repository.name}</span>
          </button>

          {breadcrumbs.map((crumb, index) => {
            const path = breadcrumbs.slice(0, index + 1).join('/')
            const isLast = index === breadcrumbs.length - 1

            return (
              <div key={path} className="flex items-center space-x-1">
                <ChevronRight className="w-3 h-3 text-white/40" />
                <button
                  onClick={() => !isLast && navigateToPath(path)}
                  className={cn(
                    'transition-colors',
                    isLast ? 'text-white' : 'text-white/60 hover:text-white'
                  )}
                >
                  {crumb}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-white/60">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            Loading files...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-400">
            <p>{error}</p>
            <button
              onClick={() => loadFiles(currentPath)}
              className="mt-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="p-4 text-center text-white/40">
            <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No files in this directory</p>
          </div>
        ) : (
          <div className="p-2">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => handleItemClick(file)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors group text-left"
              >
                {getFileIcon(file)}
                <span className="flex-1 text-sm text-white group-hover:text-white/90 truncate">
                  {file.name}
                </span>
                {file.type === 'dir' && (
                  <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-white/60" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

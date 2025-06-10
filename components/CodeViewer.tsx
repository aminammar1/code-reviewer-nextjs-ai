'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GitHubFile, CodeReview } from '@/types'
import { FileCode, Zap, Copy, Eye, Loader2, AlertCircle } from 'lucide-react'
import {
  getLanguageFromExtension,
  getFileExtension,
  formatFileSize,
} from '@/lib/utils'

interface CodeViewerProps {
  file: GitHubFile | null
  content: string
  onReviewRequest: () => void
  isLoading: boolean
  review: CodeReview | null
}

export function CodeViewer({
  file,
  content,
  onReviewRequest,
  isLoading,
  review,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const language = file
    ? getLanguageFromExtension(getFileExtension(file.name))
    : 'text'

  if (!file) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Code Viewer</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/40">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium mb-2">No file selected</h4>
            <p className="text-sm">
              Choose a file from the repository browser to view its contents
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileCode className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">{file.name}</h3>
              <p className="text-sm text-white/60">
                {formatFileSize(file.size)} • {language}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="glass glass-hover p-2 rounded-lg text-white transition-all duration-300"
              title="Copy code"
            >
              {copied ? (
                <AlertCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onReviewRequest}
              disabled={isLoading || !content}
              className="glass glass-hover px-4 py-2 rounded-lg text-white transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Reviewing...' : 'AI Review'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {content ? (
          <div className="h-full relative">
            {' '}
            {/* Review indicators overlay */}
            {review && review.suggestions.length > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/50 z-10 flex flex-col">
                {review.suggestions.map((suggestion) => {
                  if (!suggestion.lineStart) return null
                  const topPercent =
                    (suggestion.lineStart / content.split('\n').length) * 100
                  const heightPercent =
                    (((suggestion.lineEnd || suggestion.lineStart) -
                      suggestion.lineStart +
                      1) /
                      content.split('\n').length) *
                    100

                  return (
                    <div
                      key={suggestion.id}
                      className="absolute w-3 rounded-r bg-blue-400"
                      style={{
                        top: `${topPercent}%`,
                        height: `${Math.max(heightPercent, 1)}%`,
                      }}
                      title={suggestion.description}
                    />
                  )
                })}
              </div>
            )}
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                background: 'transparent',
                height: '100%',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              showLineNumbers
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: '#6b7280',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              wrapLines
              wrapLongLines
            >
              {content}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white/40">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
              <p>Loading file content...</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-white/10 bg-black/50 flex items-center justify-between text-sm text-white/60">
        <div className="flex items-center space-x-4">
          <span>{content.split('\n').length} lines</span>
          <span>{content.length} characters</span>
          {review && (
            <span className="text-blue-400">
              {review.suggestions.length} suggestions
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Eye className="w-3 h-3" />
          <span>Read-only</span>
        </div>
      </div>
    </div>
  )
}

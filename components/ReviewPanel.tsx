'use client'

import { useState } from 'react'
import { CodeReview, ReviewSuggestion } from '@/types'
import {
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Copy,
  Download,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewPanelProps {
  review: CodeReview | null
  isLoading: boolean
  onRefresh: () => void
  onApplySuggestion: (suggestion: ReviewSuggestion) => void
  className?: string
}

export function ReviewPanel({
  review,
  isLoading,
  onRefresh,
  onApplySuggestion,
  className,
}: ReviewPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportReview = () => {
    if (!review) return

    const exportData = {
      fileName: review.fileName,
      timestamp: review.timestamp,
      summary: review.summary,
      issues: review.issues,
      suggestions: review.suggestions,
      rating: review.overallRating,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `review-${review.fileName}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSeverityIcon = (
    severity: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    switch (severity) {
      case 'low':
        return <Info className="w-4 h-4 text-blue-400" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
    }
  }

  const getSeverityColor = (
    severity: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    switch (severity) {
      case 'low':
        return 'border-blue-400/30 bg-blue-400/10'
      case 'medium':
        return 'border-yellow-400/30 bg-yellow-400/10'
      case 'high':
        return 'border-orange-400/30 bg-orange-400/10'
      case 'critical':
        return 'border-red-400/30 bg-red-400/10'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400'
    if (rating >= 6) return 'text-yellow-400'
    if (rating >= 4) return 'text-orange-400'
    return 'text-red-400'
  }
  if (isLoading) {
    return (
      <div
        className={cn(
          'glass h-full flex flex-col items-center justify-center p-6',
          className
        )}
      >
        <RefreshCw className="w-8 h-8 text-white/60 animate-spin mb-4" />
        <p className="text-white/60">Analyzing code...</p>
      </div>
    )
  }

  if (!review) {
    return (
      <div
        className={cn(
          'glass h-full flex flex-col items-center justify-center text-center p-6',
          className
        )}
      >
        <MessageCircle className="w-12 h-12 text-white/40 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Review Available
        </h3>
        <p className="text-white/60 mb-4">
          Select a file to start an AI-powered code review
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Start Review
        </button>
      </div>
    )
  }
  return (
    <div
      className={cn('glass h-full flex flex-col overflow-hidden', className)}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Code Review
            </h3>
            <p className="text-sm text-white/60">{review.fileName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReview}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Export Review"
            >
              <Download className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Refresh Review"
            >
              <RefreshCw className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overall Rating */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80">Overall Rating</span>
            <span
              className={cn(
                'text-2xl font-bold',
                getRatingColor(review.overallRating)
              )}
            >
              {review.overallRating}/10
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-500',
                review.overallRating >= 8
                  ? 'bg-green-400'
                  : review.overallRating >= 6
                  ? 'bg-yellow-400'
                  : review.overallRating >= 4
                  ? 'bg-orange-400'
                  : 'bg-red-400'
              )}
              style={{ width: `${review.overallRating * 10}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card p-4">
          <h4 className="text-white font-medium mb-2">Summary</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            {review.summary}
          </p>
        </div>

        {/* Issues */}
        {review.issues.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Issues ({review.issues.length})
            </h4>
            <div className="space-y-3">
              {review.issues.map((issue, index) => (
                <div
                  key={index}
                  className={cn(
                    'glass-card p-4 border border-opacity-30',
                    getSeverityColor(issue.severity)
                  )}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium capitalize">
                          {issue.severity}
                        </span>
                        {issue.line && (
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                            Line {issue.line}
                          </span>
                        )}
                      </div>
                      <p className="text-white/80 text-sm mb-2">
                        {issue.description}
                      </p>
                      {issue.suggestion && (
                        <p className="text-white/60 text-xs italic">
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {review.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              Suggestions ({review.suggestions.length})
            </h4>
            <div className="space-y-4">
              {review.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="glass-card p-4 border border-green-400/20"
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {suggestion.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onApplySuggestion(suggestion)}
                          className="px-3 py-1 bg-green-400/20 hover:bg-green-400/30 text-green-400 text-xs rounded transition-all duration-300"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      {suggestion.description}
                    </p>
                  </div>

                  {/* Code Diff */}
                  <div className="space-y-3">
                    {suggestion.originalCode && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400 text-xs font-medium">
                            - Original
                          </span>
                          <button
                            onClick={() =>
                              handleCopyCode(
                                suggestion.originalCode!,
                                `orig-${index}`
                              )
                            }
                            className="p-1 hover:bg-white/10 rounded transition-all duration-300"
                          >
                            {copiedId === `orig-${index}` ? (
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-white/60" />
                            )}
                          </button>
                        </div>
                        <pre className="bg-red-400/10 p-3 rounded-lg text-xs text-white/80 overflow-x-auto border-l-2 border-red-400/30">
                          <code>{suggestion.originalCode}</code>
                        </pre>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 text-xs font-medium">
                          + Suggested
                        </span>
                        <button
                          onClick={() =>
                            handleCopyCode(
                              suggestion.suggestedCode,
                              `sugg-${index}`
                            )
                          }
                          className="p-1 hover:bg-white/10 rounded transition-all duration-300"
                        >
                          {copiedId === `sugg-${index}` ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/60" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-green-400/10 p-3 rounded-lg text-xs text-white/80 overflow-x-auto border-l-2 border-green-400/30">
                        <code>{suggestion.suggestedCode}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <span className="text-xs text-white/60">Helpful?</span>
                    <button className="p-1 hover:bg-white/10 rounded transition-all duration-300">
                      <ThumbsUp className="w-3 h-3 text-white/60 hover:text-green-400" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-all duration-300">
                      <ThumbsDown className="w-3 h-3 text-white/60 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-white/40 text-center pt-4 border-t border-white/10">
          Review generated at {new Date(review.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

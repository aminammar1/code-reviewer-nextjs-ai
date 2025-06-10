'use client'

import { useState } from 'react'
import { GitHubService } from '@/services/github'
import { OpenRouterService } from '@/services/openrouter'
import {
  GitHubRepository,
  GitHubFile,
  WorkspaceState,
  ReviewSuggestion,
} from '@/types'
import { RepositoryBrowser } from '@/components/RepositoryBrowser'
import { CodeViewer } from '@/components/CodeViewer'
import { ReviewPanel } from '@/components/ReviewPanel'
import { WorkspaceHeader } from '@/components/WorkspaceHeader'
import { Loader2 } from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export default function WorkspacePage() {
  const [state, setState] = useState<WorkspaceState>({
    selectedRepository: null,
    currentPath: '',
    selectedFile: null,
    fileContent: '',
    currentReview: null,
    isLoading: false,
    error: null,
  })

  const [githubService] = useState(() => new GitHubService())
  const [openRouterService] = useState(() => new OpenRouterService())

  const handleRepositorySelect = async (repository: GitHubRepository) => {
    setState((prev) => ({
      ...prev,
      selectedRepository: repository,
      currentPath: '',
      selectedFile: null,
      fileContent: '',
      currentReview: null,
      error: null,
    }))
  }

  const handleFileSelect = async (file: GitHubFile) => {
    if (file.type !== 'file') return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const [owner, repo] = state.selectedRepository!.full_name.split('/')
      const content = await githubService.getFileContent(owner, repo, file.path)

      setState((prev) => ({
        ...prev,
        selectedFile: file,
        fileContent: content,
        isLoading: false,
      }))
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Failed to load file content',
        isLoading: false,
      }))
    }
  }

  const handleReviewRequest = async () => {
    if (!state.selectedFile || !state.fileContent) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const fileName = state.selectedFile.name
      const extension = fileName.split('.').pop()?.toLowerCase() || ''

      const languageMap: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        cs: 'csharp',
        php: 'php',
        rb: 'ruby',
        go: 'go',
        rs: 'rust',
      }

      const language = languageMap[extension] || 'text'

      const review = await openRouterService.generateCodeReview(
        state.fileContent,
        fileName,
        language,
        `Repository: ${state.selectedRepository?.name}`
      )

      setState((prev) => ({
        ...prev,
        currentReview: review,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Review request failed:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to generate code review'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
    }
  }

  const handleApplySuggestion = async (suggestion: ReviewSuggestion) => {
    // For now, just show the suggestion in an alert
    // In a real implementation, this would apply the code change
    alert(`Apply suggestion: ${suggestion.title}`)
  }

  const handlePathChange = (path: string) => {
    setState((prev) => ({ ...prev, currentPath: path }))
  }
  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <WorkspaceHeader
        repository={state.selectedRepository}
        onRepositorySelect={handleRepositorySelect}
        githubService={githubService}
      />

      <div className="h-[calc(100vh-4rem)]">
        <PanelGroup direction="horizontal">
          {/* Repository Browser Panel */}
          <Panel
            defaultSize={25}
            minSize={20}
            maxSize={40}
            className="glass border-r border-white/10"
          >
            <RepositoryBrowser
              repository={state.selectedRepository}
              currentPath={state.currentPath}
              onFileSelect={handleFileSelect}
              onPathChange={handlePathChange}
              githubService={githubService}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-white/5 hover:bg-white/10 transition-colors cursor-col-resize" />

          {/* Code Viewer Panel */}
          <Panel
            defaultSize={50}
            minSize={30}
            className="border-r border-white/10"
          >
            <CodeViewer
              file={state.selectedFile}
              content={state.fileContent}
              onReviewRequest={handleReviewRequest}
              isLoading={state.isLoading}
              review={state.currentReview}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-white/5 hover:bg-white/10 transition-colors cursor-col-resize" />

          {/* Review Panel */}
          <Panel defaultSize={25} minSize={20} maxSize={40} className="glass">
            <ReviewPanel
              review={state.currentReview}
              onApplySuggestion={handleApplySuggestion}
              onRefresh={handleReviewRequest}
              isLoading={state.isLoading}
            />
          </Panel>
        </PanelGroup>
      </div>

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-lg flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg glass">
          {state.error}
        </div>
      )}
    </div>
  )
}

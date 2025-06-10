export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  default_branch: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  private: boolean
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir'
  download_url?: string
  html_url: string
}

export interface GitHubContent {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir'
  content?: string
  encoding?: string
  download_url?: string
  html_url: string
}

export interface CodeReview {
  id: string
  fileName: string
  filePath: string
  codeContent: string
  summary: string
  overallRating: number
  issues: ReviewIssue[]
  suggestions: ReviewSuggestion[]
  timestamp: string
  repository: string
}

export interface ReviewIssue {
  id: string
  line?: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  suggestion?: string
  category: 'performance' | 'security' | 'style' | 'bug' | 'maintainability'
}

export interface ReviewSuggestion {
  id: string
  title: string
  description: string
  lineStart?: number
  lineEnd?: number
  originalCode?: string
  suggestedCode: string
  category: 'performance' | 'security' | 'style' | 'bug' | 'maintainability'
}

export interface CodeSuggestion {
  id: string
  line_start: number
  line_end: number
  original_code: string
  suggested_code: string
  explanation: string
  severity: 'info' | 'warning' | 'error'
  category: 'performance' | 'security' | 'style' | 'bug' | 'maintainability'
}

export interface WorkspaceState {
  selectedRepository: GitHubRepository | null
  currentPath: string
  selectedFile: GitHubFile | null
  fileContent: string
  currentReview: CodeReview | null
  isLoading: boolean
  error: string | null
}

export interface User {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}

export interface AIReviewResponse {
  review: string
  suggestions: CodeSuggestion[]
  summary: {
    total_issues: number
    critical_issues: number
    suggestions_count: number
    overall_score: number
  }
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GitHubService } from '@/services/github'
import { GitHubRepository } from '@/types'
import { Search, Github, Code } from 'lucide-react'

interface WorkspaceHeaderProps {
  repository: GitHubRepository | null
  onRepositorySelect: (repository: GitHubRepository) => void
  githubService: GitHubService
}

export function WorkspaceHeader({
  repository,
  onRepositorySelect,
  githubService,
}: WorkspaceHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GitHubRepository[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchRepositories = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await githubService.searchRepositories(searchQuery)
        setSearchResults(results.slice(0, 10))
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchRepositories, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, githubService])

  return (
    <header className="glass border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        {' '}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
          >
            <Code className="w-6 h-6 text-white" />
            <span className="text-xl font-bold text-white">ReviewStack</span>
          </Link>

          {repository && (
            <>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-2 text-white">
                <Github className="w-4 h-4" />
                <span className="font-medium">{repository.name}</span>
                <span className="text-white/60">
                  by {repository.full_name.split('/')[0]}
                </span>
              </div>
            </>
          )}
        </div>{' '}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="glass glass-hover p-2 rounded-lg text-white transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-12 w-96 glass border border-white/20 rounded-xl p-4 z-50">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {isSearching ? (
                    <div className="text-center py-4 text-white/60">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() => {
                          onRepositorySelect(repo)
                          setIsSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-white group-hover:text-white/90">
                              {repo.name}
                            </div>
                            <div className="text-sm text-white/60 mb-1">
                              {repo.full_name}
                            </div>
                            {repo.description && (
                              <div className="text-xs text-white/50 line-clamp-2">
                                {repo.description}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-white/40 ml-2">
                            {repo.language}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <div className="text-center py-4 text-white/60">
                      No repositories found
                    </div>
                  ) : (
                    <div className="text-center py-4 text-white/60">
                      Start typing to search repositories
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

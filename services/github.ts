import { Octokit } from '@octokit/rest'
import { GitHubRepository, GitHubFile, User } from '@/types'

export class GitHubService {
  private octokit: Octokit

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
    })
  }

  async getUser(): Promise<User> {
    const { data } = await this.octokit.rest.users.getAuthenticated()
    return {
      id: data.id,
      login: data.login,
      name: data.name || '',
      email: data.email || '',
      avatar_url: data.avatar_url,
    }
  }

  async getUserRepositories(username?: string): Promise<GitHubRepository[]> {
    const { data } = username
      ? await this.octokit.rest.repos.listForUser({ username, per_page: 100 })
      : await this.octokit.rest.repos.listForAuthenticatedUser({
          per_page: 100,
        })

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || '',
      html_url: repo.html_url,
      default_branch: repo.default_branch || 'main',
      language: repo.language || 'Unknown',
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      updated_at: repo.updated_at || '',
      private: repo.private,
    }))
  }

  async getRepositoryContents(
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFile[]> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      })

      if (Array.isArray(data)) {
        return data.map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size || 0,
          type: item.type as 'file' | 'dir',
          download_url: item.download_url || undefined,
          html_url: item.html_url || '',
        }))
      } else {
        return [
          {
            name: data.name,
            path: data.path,
            sha: data.sha,
            size: data.size || 0,
            type: data.type as 'file' | 'dir',
            download_url: data.download_url || undefined,
            html_url: data.html_url || '',
          },
        ]
      }
    } catch (error) {
      console.error('Error fetching repository contents:', error)
      throw new Error('Failed to fetch repository contents')
    }
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      })

      if ('content' in data && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8')
      }

      throw new Error('File content not available')
    } catch (error) {
      console.error('Error fetching file content:', error)
      throw new Error('Failed to fetch file content')
    }
  }

  async searchRepositories(
    query: string,
    page: number = 1
  ): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.search.repos({
        q: query,
        page,
        per_page: 30,
      })

      return data.items.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        html_url: repo.html_url,
        default_branch: repo.default_branch || 'main',
        language: repo.language || 'Unknown',
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        updated_at: repo.updated_at || '',
        private: repo.private,
      }))
    } catch (error) {
      console.error('Error searching repositories:', error)
      throw new Error('Failed to search repositories')
    }
  }
}

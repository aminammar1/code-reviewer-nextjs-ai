import axios from 'axios'
import {
  AIReviewResponse,
  CodeReview,
  ReviewIssue,
  ReviewSuggestion,
} from '@/types'



export class OpenRouterService {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'
  constructor(
    apiKey: string = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
  ) {
    this.apiKey = apiKey

    if (!this.apiKey) {
      console.warn(
        'OpenRouter API key not found. Please set NEXT_PUBLIC_OPENROUTER_API_KEY environment variable.'
      )
    }
  }



  async generateCodeReview(
    code: string,
    fileName: string,
    language: string,
    context?: string
  ): Promise<CodeReview> {
    try {
      const prompt = this.buildEnhancedReviewPrompt(
        code,
        fileName,
        language,
        context
      )

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'meta-llama/llama-3.3-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert code reviewer. Provide detailed, constructive feedback on code quality, security, performance, and best practices. IMPORTANT: Respond with ONLY a valid JSON object - no additional text, markdown formatting, or explanations outside the JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1800,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://reviewstack.dev',
            'X-Title': 'ReviewStack',
          },
        }
      )

      console.log('OpenRouter API response:', response.data)

      const content = response.data.choices?.[0]?.message?.content

      if (!content) {
        console.error('No content in OpenRouter response:', response.data)
        throw new Error('No response content from OpenRouter API')
      }

      return this.parseEnhancedReviewResponse(
        content,
        fileName,
        code,
        context || ''
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenRouter API error response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(
          `OpenRouter API error (${error.response?.status}): ${
            error.response?.statusText
          }. ${JSON.stringify(error.response?.data)}`
        )
      }
      console.error('Error calling OpenRouter API:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to generate code review: Unknown error')
    }
  }



  async reviewCode(
    code: string,
    fileName: string,
    language: string,
    context?: string
  ): Promise<AIReviewResponse> {
    try {
      const prompt = this.buildReviewPrompt(code, fileName, language, context)

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'meta-llama/llama-3.3-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert code reviewer. Provide detailed, constructive feedback on code quality, security, performance, and best practices. Return your response as a JSON object with the specified structure.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1800,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://reviewstack.dev',
            'X-Title': 'ReviewStack',
          },
        }
      )

      console.log('OpenRouter API response:', response.data)

      const content = response.data.choices?.[0]?.message?.content

      if (!content) {
        console.error('No content in OpenRouter response:', response.data)
        throw new Error('No response content from OpenRouter API')
      }

      return this.parseReviewResponse(content)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenRouter API error response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(
          `OpenRouter API error (${error.response?.status}): ${
            error.response?.statusText
          }. ${JSON.stringify(error.response?.data)}`
        )
      }
      console.error('Error calling OpenRouter API:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to generate code review: Unknown error')
    }
  }



  async suggestFix(
    code: string,
    issue: string,
    language: string
  ): Promise<string> {
    try {
      const prompt = `
Please provide a specific code fix for the following issue:

**Language**: ${language}
**Issue**: ${issue}
**Current Code**:
\`\`\`${language}
${code}
\`\`\`

Provide only the corrected code without explanations. Maintain the same structure and style.
`

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'meta-llama/llama-3.3-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are a code fixing assistant. Provide only the corrected code without additional explanations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://reviewstack.dev',
            'X-Title': 'ReviewStack',
          },
        }
      )

      return response.data.choices?.[0]?.message?.content || ''
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenRouter API error response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(
          `OpenRouter API error (${error.response?.status}): ${
            error.response?.statusText
          }. ${JSON.stringify(error.response?.data)}`
        )
      }
      console.error('Error generating code fix:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to generate code fix: Unknown error')
    }
  }
  private buildEnhancedReviewPrompt(
    code: string,
    fileName: string,
    language: string,
    context?: string
  ): string {
    return `
Please review the following ${language} code from file "${fileName}" and provide detailed feedback.

${context ? `**Context**: ${context}` : ''}

**Code to Review**:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: Please respond with ONLY a valid JSON object in this exact format (no additional text, markdown, or explanations):

{
  "summary": "Brief summary of the code review",
  "overallRating": 7,
  "issues": [
    {
      "id": "issue-1",
      "line": 10,
      "severity": "medium",
      "description": "Description of the issue",
      "suggestion": "How to fix it",
      "category": "maintainability"
    }
  ],
  "suggestions": [
    {
      "id": "suggestion-1",
      "title": "Brief title of the suggestion",
      "description": "Detailed description",
      "lineStart": 5,
      "lineEnd": 8,
      "originalCode": "current code snippet",
      "suggestedCode": "improved code",
      "category": "performance"
    }
  ]
}

Valid severity values: "low", "medium", "high", "critical"
Valid category values: "performance", "security", "style", "bug", "maintainability"

Focus on:
- Code quality and best practices
- Security vulnerabilities
- Performance optimizations
- Maintainability improvements
- Style and formatting
- Potential bugs or edge cases
`
  }

  private buildReviewPrompt(
    code: string,
    fileName: string,
    language: string,
    context?: string
  ): string {
    return `
Please review the following ${language} code from file "${fileName}" and provide detailed feedback.

${context ? `**Context**: ${context}` : ''}

**Code to Review**:
\`\`\`${language}
${code}
\`\`\`

Please provide your response as a JSON object with the following structure:
{
  "review": "Overall review summary and comments",
  "suggestions": [
    {
      "id": "unique-id",
      "line_start": number,
      "line_end": number,
      "original_code": "code snippet",
      "suggested_code": "improved code",
      "explanation": "explanation of the suggestion",
      "severity": "info|warning|error",
      "category": "performance|security|style|bug|maintainability"
    }
  ],
  "summary": {
    "total_issues": number,
    "critical_issues": number,
    "suggestions_count": number,
    "overall_score": number (1-10)
  }
}

Focus on:
- Code quality and best practices
- Security vulnerabilities
- Performance optimizations
- Maintainability improvements
- Style and formatting
- Potential bugs or edge cases
`
  }
  private parseEnhancedReviewResponse(
    content: string,
    fileName: string,
    code: string,
    repository: string
  ): CodeReview {
    try {
      console.log('Raw OpenRouter response content:', content) // Try multiple JSON extraction methods
      let parsed: {
        summary?: string
        overallRating?: number
        issues?: Array<{
          id?: string
          line?: number
          severity?: string
          description?: string
          suggestion?: string
          category?: string
        }>
        suggestions?: Array<{
          id?: string
          title?: string
          description?: string
          lineStart?: number
          lineEnd?: number
          originalCode?: string
          suggestedCode?: string
          category?: string
        }>
      } | null = null

      // Method 1: Look for JSON between code blocks
      const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/i)
      if (codeBlockMatch) {
        try {
          parsed = JSON.parse(codeBlockMatch[1])
        } catch (e) {
          console.log('Failed to parse JSON from code block:', e)
        }
      }

      // Method 2: Look for any JSON-like structure
      if (!parsed) {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0])
          } catch (e) {
            console.log('Failed to parse JSON from match:', e)
          }
        }
      }

      // Method 3: Try to find JSON starting with specific keys
      if (!parsed) {
        const structuredMatch = content.match(
          /\{\s*["'](?:summary|review|issues|suggestions)["'][\s\S]*\}/
        )
        if (structuredMatch) {
          try {
            parsed = JSON.parse(structuredMatch[0])
          } catch (e) {
            console.log('Failed to parse structured JSON:', e)
          }
        }
      }

      // Method 4: Clean and try to parse the entire content
      if (!parsed) {
        try {
          // Remove markdown formatting and extra text
          const cleanContent = content
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .replace(/^[^{]*/, '') // Remove everything before first {
            .replace(/[^}]*$/, '') // Remove everything after last }
            .trim()

          if (cleanContent.startsWith('{') && cleanContent.endsWith('}')) {
            parsed = JSON.parse(cleanContent)
          }
        } catch (e) {
          console.log('Failed to parse cleaned content:', e)
        }
      }

      if (!parsed) {
        throw new Error('No valid JSON structure found in AI response')
      }

      console.log('Successfully parsed JSON:', parsed) // Add IDs to issues and suggestions if missing
      const issues: ReviewIssue[] = (parsed.issues || []).map(
        (
          issue: {
            id?: string
            line?: number
            severity?: string
            description?: string
            suggestion?: string
            category?: string
          },
          index: number
        ) => ({
          id: issue.id || `issue-${index + 1}`,
          line: issue.line,
          severity: (['low', 'medium', 'high', 'critical'].includes(
            issue.severity || ''
          )
            ? issue.severity
            : 'medium') as 'low' | 'medium' | 'high' | 'critical',
          description: issue.description || 'Issue description not provided',
          suggestion: issue.suggestion,
          category: ([
            'performance',
            'security',
            'style',
            'bug',
            'maintainability',
          ].includes(issue.category || '')
            ? issue.category
            : 'maintainability') as
            | 'performance'
            | 'security'
            | 'style'
            | 'bug'
            | 'maintainability',
        })
      )

      const suggestions: ReviewSuggestion[] = (parsed.suggestions || []).map(
        (
          suggestion: {
            id?: string
            title?: string
            description?: string
            lineStart?: number
            lineEnd?: number
            originalCode?: string
            suggestedCode?: string
            category?: string
          },
          index: number
        ) => ({
          id: suggestion.id || `suggestion-${index + 1}`,
          title: suggestion.title || `Suggestion ${index + 1}`,
          description:
            suggestion.description || 'Suggestion description not provided',
          lineStart: suggestion.lineStart,
          lineEnd: suggestion.lineEnd,
          originalCode: suggestion.originalCode,
          suggestedCode: suggestion.suggestedCode || '',
          category: ([
            'performance',
            'security',
            'style',
            'bug',
            'maintainability',
          ].includes(suggestion.category || '')
            ? suggestion.category
            : 'maintainability') as
            | 'performance'
            | 'security'
            | 'style'
            | 'bug'
            | 'maintainability',
        })
      )

      return {
        id: `review-${Date.now()}`,
        fileName,
        filePath: fileName,
        codeContent: code,
        summary: parsed.summary || 'Code review completed',
        overallRating: Math.min(10, Math.max(1, parsed.overallRating || 7)),
        issues,
        suggestions,
        timestamp: new Date().toISOString(),
        repository,
      }
    } catch (error) {
      console.error('Error parsing enhanced review response:', error)
      console.error('Response content that failed to parse:', content)

      // Create a basic review from the text content
      const basicSummary =
        content.length > 500 ? content.substring(0, 500) + '...' : content

      return {
        id: `review-${Date.now()}`,
        fileName,
        filePath: fileName,
        codeContent: code,
        summary:
          basicSummary ||
          'Code review completed with limited analysis due to parsing error.',
        overallRating: 7,
        issues: [
          {
            id: 'parsing-error',
            severity: 'medium',
            description: 'Unable to parse AI response. Please try again.',
            category: 'maintainability',
          },
        ],
        suggestions: [
          {
            id: 'retry-suggestion',
            title: 'Retry Code Review',
            description:
              'The AI response could not be parsed properly. Please try running the code review again.',
            suggestedCode: '',
            category: 'maintainability',
          },
        ],
        timestamp: new Date().toISOString(),
        repository,
      }
    }
  }

  private parseReviewResponse(content: string): AIReviewResponse {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate the structure
      if (!parsed.review || !parsed.suggestions || !parsed.summary) {
        throw new Error('Invalid response structure')
      }

      // Add IDs to suggestions if missing
      parsed.suggestions = parsed.suggestions.map(
        (
          suggestion: { id?: string; [key: string]: unknown },
          index: number
        ) => ({
          ...suggestion,
          id: suggestion.id || `suggestion-${index + 1}`,
        })
      )

      return parsed
    } catch (error) {
      console.log('Error parsing review response:', error)

      // Fallback response
      return {
        review: content.slice(0, 500) + '...',
        suggestions: [],
        summary: {
          total_issues: 0,
          critical_issues: 0,
          suggestions_count: 0,
          overall_score: 7,
        },
      }
    }
  }
}

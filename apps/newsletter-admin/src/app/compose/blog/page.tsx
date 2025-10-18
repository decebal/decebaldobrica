'use client'

import { Button } from '@decebal/ui/button'
import { Textarea } from '@decebal/ui/textarea'
import { Input } from '@decebal/ui/input'
import { Label } from '@decebal/ui/label'
import { Badge } from '@decebal/ui/badge'
import {
  Brain,
  Download,
  Loader2,
  Sparkles,
  Wand2,
  FileText,
  Send
} from 'lucide-react'
import { useState } from 'react'

interface BlogSection {
  id: string
  title: string
  content: string
  aiGenerated: boolean
}

type AIMode = 'groq' | 'anythingllm'

export default function AIBlogComposerPage() {
  const [topic, setTopic] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [targetAudience, setTargetAudience] = useState('CTOs and Engineering Leaders')
  const [tone, setTone] = useState('professional')
  const [aiMode, setAiMode] = useState<AIMode>('anythingllm')

  const [sections, setSections] = useState<BlogSection[]>([])
  const [generating, setGenerating] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [progressLog, setProgressLog] = useState<string[]>([])

  const generateFullPost = async () => {
    if (!topic) return

    setGenerating(true)
    setProgressLog([])
    setSections([])

    try {
      const response = await fetch('/api/admin/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_post',
          topic,
          keyPoints,
          targetAudience,
          tone,
          mode: aiMode
        })
      })

      const data = await response.json()

      if (data.error) {
        setProgressLog(prev => [...prev, `❌ Error: ${data.error}`])
        return
      }

      if (data.sections) {
        setSections(data.sections)
        setProgressLog(prev => [...prev, `✅ Generated ${data.sections.length} sections successfully!`])
      }

      if (data.research) {
        setProgressLog(prev => [
          ...prev,
          `📚 Research: Found ${data.research.frameworks?.length || 0} frameworks, ${data.research.experiences?.length || 0} experiences`
        ])
      }
    } catch (error) {
      console.error('Failed to generate post:', error)
      setProgressLog(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    } finally {
      setGenerating(false)
    }
  }

  const regenerateSection = async (sectionId: string) => {
    setCurrentSection(sectionId)
    try {
      const section = sections.find(s => s.id === sectionId)
      if (!section) return

      const response = await fetch('/api/admin/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate_section',
          sectionId,
          sectionTitle: section.title,
          topic,
          context: sections.map(s => ({ title: s.title, content: s.content }))
        })
      })

      const data = await response.json()

      if (data.content) {
        setSections(sections.map(s =>
          s.id === sectionId
            ? { ...s, content: data.content, aiGenerated: true }
            : s
        ))
      }
    } catch (error) {
      console.error('Failed to regenerate section:', error)
    } finally {
      setCurrentSection(null)
    }
  }

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, content, aiGenerated: false }
        : s
    ))
  }

  const exportMarkdown = () => {
    const markdown = sections.map(s => {
      return `## ${s.title}\n\n${s.content}\n\n`
    }).join('\n')

    const fullMarkdown = `---
title: '${topic}'
date: '${new Date().toISOString()}'
author: Decebal D.
description: Generated with AI assistance
tags: []
slug: ${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
---

${markdown}`

    const blob = new Blob([fullMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mdx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-brand-teal" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Blog Post Composer
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Generate blog posts using AI with STAR methodology + Golden Nuggets structure
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            {/* AI Mode Toggle */}
            <div>
              <Label htmlFor="aiMode">AI Generation Mode</Label>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setAiMode('anythingllm')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                    aiMode === 'anythingllm'
                      ? 'border-brand-teal bg-brand-teal/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-5 w-5 text-brand-teal" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      AnythingLLM (RAG)
                    </span>
                    <Badge className="bg-green-500 text-white">Recommended</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uses your knowledge base for personalized content with your style and experiences
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiMode('groq')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                    aiMode === 'groq'
                      ? 'border-brand-teal bg-brand-teal/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Groq (Basic)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Direct LLM generation without knowledge base
                  </p>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="topic">Blog Post Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How I Reduced API Latency by 80% Using Rust"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="keyPoints">Key Points / Context (optional)</Label>
              <Textarea
                id="keyPoints"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Bullet points of main ideas, technical details, metrics..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
            </div>

            <Button
              onClick={generateFullPost}
              disabled={generating || !topic}
              className="w-full bg-brand-teal hover:bg-brand-teal/80"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Full Blog Post
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Log */}
        {progressLog.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 font-mono text-sm">
            {progressLog.map((log, idx) => (
              <div key={idx} className="text-gray-700 dark:text-gray-300">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Generated Sections */}
        {sections.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Content
              </h2>
              <Button onClick={exportMarkdown} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export MDX
              </Button>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      {section.aiGenerated && (
                        <Badge className="bg-brand-teal/20 text-brand-teal border-0">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => regenerateSection(section.id)}
                      disabled={currentSection === section.id}
                      variant="outline"
                      size="sm"
                    >
                      {currentSection === section.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

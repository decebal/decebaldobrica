'use client'

import { newsletterApi } from '@/lib/api'
import { Eye, Mail, Send, Sparkles, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ComposeNewsletterPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [tier, setTier] = useState<'all' | 'free' | 'premium' | 'founding'>('all')
  const [sending, setSending] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSend = async () => {
    if (!subject || !content) {
      alert('Please fill in subject and content')
      return
    }

    if (!confirm(`Are you sure you want to send this newsletter to ${tier} subscribers?`)) {
      return
    }

    setSending(true)

    try {
      const result = await newsletterApi.sendNewsletter({
        subject,
        content,
        tier,
      })

      if (result.success) {
        alert(`✅ Newsletter sent to ${result.sent} subscribers!`)
        setSubject('')
        setContent('')
      } else {
        alert(`❌ Failed to send newsletter: ${result.error}`)
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('An error occurred while sending')
    } finally {
      setSending(false)
    }
  }

  const characterCount = content.length
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-100 to-pink-100 dark:from-violet-950 dark:via-fuchsia-950 dark:to-pink-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 mb-4 inline-flex items-center gap-2 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground shadow-lg">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Compose Newsletter
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Create and send newsletters to your subscribers
          </p>
        </div>

        {/* Composer */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6 border border-border">
          <div className="space-y-6">
            {/* Tier Selection */}
            <div>
              <label
                htmlFor="tier-select"
                className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3"
              >
                <Users className="h-4 w-4 text-primary" />
                Send To
              </label>
              <select
                id="tier-select"
                value={tier}
                onChange={(e) => setTier(e.target.value as typeof tier)}
                className="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none transition-colors font-medium"
              >
                <option value="all">📧 All Subscribers</option>
                <option value="free">🆓 Free Tier Only</option>
                <option value="premium">💎 Premium Only</option>
                <option value="founding">⭐ Founding Members Only</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject-input"
                className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Subject Line
              </label>
              <input
                id="subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter an engaging subject line..."
                className="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none transition-colors"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Best practices: Keep it under 50 characters, make it curiosity-driven
              </p>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content-textarea"
                className="flex items-center justify-between text-sm font-semibold text-card-foreground mb-3"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Newsletter Content
                </div>
                <div className="text-xs font-normal text-muted-foreground">
                  {wordCount} words • {characterCount} characters
                </div>
              </label>
              <textarea
                id="content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your newsletter content here... (HTML and Markdown supported)"
                rows={18}
                className="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none transition-colors font-mono text-sm resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Supports HTML and Markdown • Links, bold, italic, code blocks
              </p>
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-accent rounded-lg p-6 border-2 border-primary/20">
                <h3 className="text-sm font-bold text-accent-foreground mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Email Preview
                </h3>
                <div className="bg-card rounded-lg p-6 shadow-inner">
                  <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                  <p className="text-lg font-bold text-card-foreground mb-4">
                    {subject || '(No subject)'}
                  </p>
                  <div className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed">
                    {content || '(No content)'}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !subject || !content}
                className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  sending || !subject || !content
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-105'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Newsletter
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all content?')) {
                    setSubject('')
                    setContent('')
                  }
                }}
                className="px-6 py-4 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 dark:bg-blue-950 rounded-xl p-6 border border-blue-300 dark:border-blue-800">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Writing Tips
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Start with a hook - grab attention in the first sentence
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Keep paragraphs short (2-3 sentences max)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Use bullet points for easy scanning
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                Include one clear call-to-action
              </li>
            </ul>
          </div>

          <div className="bg-green-100 dark:bg-green-950 rounded-xl p-6 border border-green-300 dark:border-green-800">
            <h3 className="text-sm font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <Send className="h-4 w-4" />
              Best Practices
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Test send to yourself before sending to all
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Aim for 300-500 words for optimal engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Send on Tuesday-Thursday, 10am-2pm
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Use blog publishing script for automated sends
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

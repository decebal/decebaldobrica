'use client'

import { newsletterApi } from '@/lib/api'
import Link from 'next/link'
import { useState } from 'react'

export default function ComposeNewsletterPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [tier, setTier] = useState<'all' | 'free' | 'premium' | 'founding'>('all')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!subject || !content) {
      alert('Please fill in subject and content')
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
        alert(`Newsletter sent to ${result.sent} subscribers!`)
        setSubject('')
        setContent('')
      } else {
        alert(`Failed to send newsletter: ${result.error}`)
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('An error occurred while sending')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Compose Newsletter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Send newsletters to your subscribers</p>
        </div>

        {/* Composer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Tier Selection */}
          <div>
            <label
              htmlFor="tier-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Send To
            </label>
            <select
              id="tier-select"
              value={tier}
              onChange={(e) => setTier(e.target.value as typeof tier)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Subscribers</option>
              <option value="free">Free Tier Only</option>
              <option value="premium">Premium Only</option>
              <option value="founding">Founding Members Only</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Subject Line
            </label>
            <input
              id="subject-input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content-textarea"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <textarea
              id="content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter content here... (HTML and Markdown supported)"
              rows={16}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Tip: Use HTML or Markdown for formatting. Links, bold, italic, code blocks are
              supported.
            </p>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
            <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                Subject: {subject || '(No subject)'}
              </p>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {content || '(No content)'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                sending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
              }`}
            >
              {sending ? 'Sending...' : 'Send Newsletter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubject('')
                setContent('')
              }}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Keep subject lines under 50 characters for better open rates</li>
            <li>• Include a clear call-to-action in your content</li>
            <li>• Test send to yourself first before sending to all subscribers</li>
            <li>• Use the blog publishing script for automated newsletters</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

#!/usr/bin/env bun

/**
 * Blog Post Creation Script with Viral LinkedIn + STAR Methodology
 *
 * Interactive CLI to create new blog posts following:
 * - Viral LinkedIn content principles (hook, examples, core insight, actionable advice)
 * - STAR methodology (Situation, Task, Action, Result)
 * - 3 Business Golden Nuggets
 * - 3 Thinking Tools
 *
 * Usage: bun ./scripts/create-blog-post.ts
 */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline/promises'

interface BlogPost {
  title: string
  date: string
  author: string
  description: string
  tags: string[]
  slug: string

  // Viral LinkedIn Hook
  hook: string

  // STAR Methodology
  situation: {
    context: string
    problem: string
    marketResearch?: string
    businessImpact: string
  }

  task: {
    goals: string[]
    constraints: string[]
    successMetrics: string[]
  }

  actions: Array<{
    title: string
    description: string
    implementation: string
    files?: string[]
    result: string
  }>

  result: {
    metrics: Array<{
      metric: string
      before: string
      after: string
      improvement: string
    }>
    businessImpact: string[]
    lessonsLearned: string[]
  }

  // Business Golden Nuggets (3 required)
  goldenNuggets: Array<{
    title: string
    lesson: string
    framework: string
    businessImpact: string
    actionableAdvice: string[]
    realWorldApplication: string
  }>

  // Thinking Tools (3 required)
  thinkingTools: Array<{
    name: string
    description: string
    howApplied: string
    mentalModel: string
    whyItWorked: string
    whenToUse: string
    exampleInAction: string
  }>

  // Closing
  conclusion: string
  resources: string[]
}

const rl = readline.createInterface({ input, output })

async function prompt(question: string): Promise<string> {
  const answer = await rl.question(`${question} `)
  return answer.trim()
}

async function promptMultiline(question: string): Promise<string> {
  console.log(`\n${question}`)
  console.log("(Press Enter twice when done, or type 'END' on a new line)\n")

  const lines: string[] = []
  let emptyLineCount = 0

  while (true) {
    const line = await rl.question('')

    if (line.trim() === 'END') {
      break
    }

    if (line.trim() === '') {
      emptyLineCount++
      if (emptyLineCount >= 2) {
        break
      }
    } else {
      emptyLineCount = 0
    }

    lines.push(line)
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop()
  }

  return lines.join('\n')
}

async function promptList(question: string): Promise<string[]> {
  console.log(`\n${question}`)
  console.log('(Enter one item per line, press Enter twice when done)\n')

  const items: string[] = []
  let emptyLineCount = 0

  while (true) {
    const line = await rl.question(`${items.length + 1}. `)

    if (line.trim() === '') {
      emptyLineCount++
      if (emptyLineCount >= 2) {
        break
      }
      continue
    }

    emptyLineCount = 0
    items.push(line.trim())
  }

  return items
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function promptActions(): Promise<BlogPost['actions']> {
  console.log('\n🎬 ACTIONS (STAR Methodology)\n')
  console.log('Enter 3-5 key actions taken')

  const actions: BlogPost['actions'] = []

  while (actions.length < 5) {
    console.log(`\n--- Action ${actions.length + 1} ---`)

    const title = await prompt('Action title (or press Enter to finish):')
    if (!title) break

    const description = await promptMultiline('Description:')
    const implementation = await promptMultiline('Implementation details (code/strategy):')
    const filesInput = await prompt('Files modified (comma-separated, optional):')
    const result = await promptMultiline('Immediate result:')

    actions.push({
      title,
      description,
      implementation,
      files: filesInput ? filesInput.split(',').map((f) => f.trim()) : undefined,
      result,
    })

    if (actions.length >= 3) {
      const more = await prompt('Add another action? (yes/no):')
      if (more.toLowerCase() !== 'yes' && more.toLowerCase() !== 'y') {
        break
      }
    }
  }

  return actions
}

async function promptMetrics(): Promise<BlogPost['result']['metrics']> {
  console.log('\n📊 RESULT METRICS\n')
  console.log('Enter 4-6 key metrics (Before → After)')

  const metrics: BlogPost['result']['metrics'] = []

  while (metrics.length < 6) {
    console.log(`\n--- Metric ${metrics.length + 1} ---`)

    const metric = await prompt('Metric name (or press Enter to finish):')
    if (!metric) break

    const before = await prompt('Before:')
    const after = await prompt('After:')
    const improvement = await prompt('Improvement (e.g., -30%, +10%):')

    metrics.push({ metric, before, after, improvement })

    if (metrics.length >= 4) {
      const more = await prompt('Add another metric? (yes/no):')
      if (more.toLowerCase() !== 'yes' && more.toLowerCase() !== 'y') {
        break
      }
    }
  }

  return metrics
}

async function promptGoldenNuggets(): Promise<BlogPost['goldenNuggets']> {
  console.log('\n💎 BUSINESS GOLDEN NUGGETS (3 required)\n')

  const nuggets: BlogPost['goldenNuggets'] = []

  for (let i = 0; i < 3; i++) {
    console.log(`\n=== Golden Nugget ${i + 1} ===`)

    const title = await prompt('Title:')
    const lesson = await promptMultiline('The Lesson:')
    const framework = await promptMultiline('The Framework:')
    const businessImpact = await promptMultiline('Business Impact:')
    const actionableAdvice = await promptList('Actionable Advice (list):')
    const realWorldApplication = await promptMultiline('Real-World Application:')

    nuggets.push({
      title,
      lesson,
      framework,
      businessImpact,
      actionableAdvice,
      realWorldApplication,
    })
  }

  return nuggets
}

async function promptThinkingTools(): Promise<BlogPost['thinkingTools']> {
  console.log('\n🧠 THINKING TOOLS (3 required)\n')

  const tools: BlogPost['thinkingTools'] = []

  for (let i = 0; i < 3; i++) {
    console.log(`\n=== Thinking Tool ${i + 1} ===`)

    const name = await prompt('Tool name:')
    const description = await promptMultiline('What it is:')
    const howApplied = await promptMultiline('How you applied it:')
    const mentalModel = await promptMultiline('Mental model/diagram:')
    const whyItWorked = await promptMultiline('Why it worked:')
    const whenToUse = await promptMultiline('When to use this tool:')
    const exampleInAction = await promptMultiline('Example in action:')

    tools.push({
      name,
      description,
      howApplied,
      mentalModel,
      whyItWorked,
      whenToUse,
      exampleInAction,
    })
  }

  return tools
}

function generateMarkdown(post: BlogPost): string {
  const md: string[] = []

  // Frontmatter
  md.push('---')
  md.push(`title: '${post.title}'`)
  md.push(`date: '${post.date}'`)
  md.push(`author: ${post.author}`)
  md.push(`description: ${post.description}`)
  md.push('tags:')
  for (const tag of post.tags) {
    md.push(`  - ${tag}`)
  }
  md.push(`slug: ${post.slug}`)
  md.push('---\n')

  // Hook
  md.push(`## ${post.hook.split('\n')[0]}`)
  md.push('')
  md.push(post.hook)
  md.push('')
  md.push('---\n')

  // Executive Summary
  md.push('## Executive Summary\n')
  md.push('**Key Results:**')
  for (const metric of post.result.metrics.slice(0, 4)) {
    md.push(`- ${metric.metric}: ${metric.before} → ${metric.after} (${metric.improvement})`)
  }
  md.push('')
  md.push('---\n')

  // Situation
  md.push('## Situation: The Challenge\n')
  md.push('### Context\n')
  md.push(post.situation.context)
  md.push('')
  md.push('### The Problem\n')
  md.push(post.situation.problem)
  md.push('')
  if (post.situation.marketResearch) {
    md.push('### Market Research\n')
    md.push(post.situation.marketResearch)
    md.push('')
  }
  md.push('### Business Impact\n')
  md.push(post.situation.businessImpact)
  md.push('')
  md.push('---\n')

  // Task
  md.push('## Task: Define Clear Goals\n')
  md.push('### Primary Objectives\n')
  for (const goal of post.task.goals) {
    md.push(`- ${goal}`)
  }
  md.push('')
  md.push('### Constraints\n')
  for (const constraint of post.task.constraints) {
    md.push(`- ${constraint}`)
  }
  md.push('')
  md.push('### Success Metrics\n')
  for (const metric of post.task.successMetrics) {
    md.push(`- ${metric}`)
  }
  md.push('')
  md.push('---\n')

  // Actions
  md.push('## Action: Strategic Implementation\n')
  for (const [index, action] of post.actions.entries()) {
    md.push(`### Action ${index + 1}: ${action.title}\n`)
    md.push('**Problem Addressed:**')
    md.push(action.description)
    md.push('')
    md.push('**Implementation:**')
    md.push(action.implementation)
    md.push('')
    if (action.files && action.files.length > 0) {
      md.push('**Files Modified:**')
      for (const file of action.files) {
        md.push(`- \`${file}\``)
      }
      md.push('')
    }
    md.push('**Immediate Results:**')
    md.push(action.result)
    md.push('')
    md.push('---\n')
  }

  // Result
  md.push('## Result: Measurable Impact Achieved\n')
  md.push('### Performance Metrics: Before vs After\n')
  md.push('| Metric | Before | After | Improvement |')
  md.push('|--------|--------|-------|-------------|')
  for (const metric of post.result.metrics) {
    md.push(
      `| **${metric.metric}** | ${metric.before} | ${metric.after} | **${metric.improvement}** |`
    )
  }
  md.push('')
  md.push('### Business Impact\n')
  for (const impact of post.result.businessImpact) {
    md.push(`- ${impact}`)
  }
  md.push('')
  md.push('### Lessons Learned\n')
  for (const lesson of post.result.lessonsLearned) {
    md.push(`- ${lesson}`)
  }
  md.push('')
  md.push('---\n')

  // Golden Nuggets
  md.push('## Business Golden Nuggets\n')
  for (const [index, nugget] of post.goldenNuggets.entries()) {
    md.push(`### Nugget ${index + 1}: ${nugget.title}\n`)
    md.push('**The Lesson:**')
    md.push(nugget.lesson)
    md.push('')
    md.push('**The Framework:**')
    md.push('```')
    md.push(nugget.framework)
    md.push('```')
    md.push('')
    md.push('**Business Impact:**')
    md.push(nugget.businessImpact)
    md.push('')
    md.push('**Actionable Advice:**')
    for (const advice of nugget.actionableAdvice) {
      md.push(`1. ${advice}`)
    }
    md.push('')
    md.push('**Real-World Application:**')
    md.push(nugget.realWorldApplication)
    md.push('')
    md.push('---\n')
  }

  // Thinking Tools
  md.push('## Thinking Tools That Made This Possible\n')
  for (const [index, tool] of post.thinkingTools.entries()) {
    md.push(`### Thinking Tool ${index + 1}: ${tool.name}\n`)
    md.push('**What It Is:**')
    md.push(tool.description)
    md.push('')
    md.push('**How I Applied It:**')
    md.push(tool.howApplied)
    md.push('')
    md.push('**The Mental Model:**')
    md.push('```')
    md.push(tool.mentalModel)
    md.push('```')
    md.push('')
    md.push('**Why It Worked:**')
    md.push(tool.whyItWorked)
    md.push('')
    md.push('**When to Use This Tool:**')
    md.push(tool.whenToUse)
    md.push('')
    md.push('**Example in Action:**')
    md.push(tool.exampleInAction)
    md.push('')
    md.push('---\n')
  }

  // Conclusion
  md.push('## Conclusion\n')
  md.push(post.conclusion)
  md.push('')
  md.push('---\n')

  // Resources
  if (post.resources.length > 0) {
    md.push('## Resources\n')
    for (const resource of post.resources) {
      md.push(`- ${resource}`)
    }
    md.push('')
  }

  return md.join('\n')
}

async function createBlogPost() {
  console.log('✍️  Blog Post Creation Tool')
  console.log('============================')
  console.log('Follows: Viral LinkedIn Principles + STAR Methodology')
  console.log('Includes: 3 Golden Nuggets + 3 Thinking Tools\n')

  const post: Partial<BlogPost> = {}

  // Basic Info
  console.log('📝 BASIC INFORMATION\n')
  post.title = await prompt('Title:')
  const dateSlug = new Date().toISOString().split('T')[0]
  const titleSlug = slugify(post.title)
  post.slug = await prompt(`Slug (default: ${dateSlug}-${titleSlug}):`)
  if (!post.slug) {
    post.slug = `${dateSlug}-${titleSlug}`
  }
  post.date = new Date().toISOString()
  post.author = 'Decebal D.'
  post.description = await promptMultiline('Description (SEO, 150-160 chars):')
  const tagsInput = await prompt('Tags (comma-separated):')
  post.tags = tagsInput.split(',').map((t) => t.trim())

  // Hook
  console.log('\n🎣 VIRAL LINKEDIN HOOK\n')
  console.log('Start with a bold, attention-grabbing statement')
  post.hook = await promptMultiline('Hook (3-5 lines):')

  // Situation
  console.log('\n📍 SITUATION (STAR Methodology)\n')
  post.situation = {
    context: await promptMultiline('Context:'),
    problem: await promptMultiline('The Problem:'),
    businessImpact: await promptMultiline('Business Impact:'),
  }

  const includeResearch = await prompt('Include market research? (yes/no):')
  if (includeResearch.toLowerCase() === 'yes' || includeResearch.toLowerCase() === 'y') {
    post.situation.marketResearch = await promptMultiline('Market Research:')
  }

  // Task
  console.log('\n🎯 TASK (STAR Methodology)\n')
  post.task = {
    goals: await promptList('Primary Objectives/Goals:'),
    constraints: await promptList('Constraints:'),
    successMetrics: await promptList('Success Metrics:'),
  }

  // Actions
  post.actions = await promptActions()

  // Result
  console.log('\n📈 RESULT (STAR Methodology)\n')
  post.result = {
    metrics: await promptMetrics(),
    businessImpact: await promptList('Business Impact:'),
    lessonsLearned: await promptList('Lessons Learned:'),
  }

  // Golden Nuggets
  post.goldenNuggets = await promptGoldenNuggets()

  // Thinking Tools
  post.thinkingTools = await promptThinkingTools()

  // Conclusion
  console.log('\n🎬 CONCLUSION\n')
  post.conclusion = await promptMultiline('Conclusion:')

  // Resources
  console.log('\n📚 RESOURCES (optional)\n')
  post.resources = await promptList('Resources (links, books, tools):')

  // Generate markdown
  const markdown = generateMarkdown(post as BlogPost)

  // Preview
  console.log(`\n${'='.repeat(80)}`)
  console.log('PREVIEW')
  console.log('='.repeat(80))
  console.log(`${markdown.substring(0, 1000)}...\n`)

  const confirm = await prompt('Create this blog post? (yes/no):')
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled')
    rl.close()
    return
  }

  // Write file
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const filePath = join(contentDir, `${post.slug}.mdx`)

    writeFileSync(filePath, markdown, 'utf-8')

    console.log('\n✅ Blog post created successfully!')
    console.log(`   Title: ${post.title}`)
    console.log(`   Slug: ${post.slug}`)
    console.log(`   File: ${filePath}`)
    console.log('\nNext steps:')
    console.log('1. Review and edit the content')
    console.log('2. Add code examples if needed')
    console.log(`3. Publish with: bun run publish-post --slug=${post.slug}`)
  } catch (error) {
    console.error('\n❌ Error creating blog post:', error)
    rl.close()
    process.exit(1)
  }

  rl.close()
}

createBlogPost()

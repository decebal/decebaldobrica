#!/usr/bin/env bun

/**
 * Case Study Addition Script
 *
 * Interactive CLI to add new case studies to the portfolio.
 * Prompts for all required information and updates caseStudies.ts
 *
 * Usage: bun ./scripts/add-case-study.ts
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline/promises'

interface CaseStudy {
  id: string
  slug: string
  title: string
  tagline: string
  industry: string
  role: string
  personName: string
  personTitle: string
  companyName: string
  companyIndustry: string
  problem: string
  impact: string
  framework: string
  actions: string[]
  outcomes: string[]
  lesson: string
  prescriptions: string[]
  color: string
  icon?: string
  metrics: {
    label: string
    value: string
  }[]
}

const rl = readline.createInterface({ input, output })

const colors = ['teal', 'purple', 'blue', 'green', 'orange', 'red', 'pink', 'indigo', 'cyan']

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

  // Remove trailing empty lines
  while (lines.length > 0 && (lines[lines.length - 1] ?? '').trim() === '') {
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

async function promptMetrics(): Promise<{ label: string; value: string }[]> {
  console.log('\n📊 Metrics (enter 2-4 key metrics)')
  console.log('(Press Enter twice when done)\n')

  const metrics: { label: string; value: string }[] = []
  let emptyLineCount = 0

  while (metrics.length < 4) {
    const label = await rl.question(`Metric ${metrics.length + 1} label: `)

    if (label.trim() === '') {
      emptyLineCount++
      if (emptyLineCount >= 2) {
        break
      }
      continue
    }

    const value = await rl.question(`Metric ${metrics.length + 1} value: `)
    if (value.trim() === '') {
      emptyLineCount++
      if (emptyLineCount >= 2) {
        break
      }
      continue
    }

    emptyLineCount = 0
    metrics.push({ label: label.trim(), value: value.trim() })
  }

  return metrics
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function formatCaseStudy(study: CaseStudy): string {
  return `  {
    id: '${study.id}',
    slug: '${study.slug}',
    title: '${escapeString(study.title)}',
    tagline: '${escapeString(study.tagline)}',
    industry: '${escapeString(study.industry)}',
    role: '${escapeString(study.role)}',

    // Frustration
    personName: '${escapeString(study.personName)}',
    personTitle: '${escapeString(study.personTitle)}',
    companyName: '${escapeString(study.companyName)}',
    companyIndustry: '${escapeString(study.companyIndustry)}',
    problem:
      '${escapeString(study.problem)}',
    impact:
      '${escapeString(study.impact)}',

    // Fix
    framework:
      '${escapeString(study.framework)}',
    actions: [
${study.actions.map((action) => `      '${escapeString(action)}',`).join('\n')}
    ],
    outcomes: [
${study.outcomes.map((outcome) => `      '${escapeString(outcome)}',`).join('\n')}
    ],

    // Future
    lesson:
      '${escapeString(study.lesson)}',
    prescriptions: [
${study.prescriptions.map((prescription) => `      '${escapeString(prescription)}',`).join('\n')}
    ],

    color: '${study.color}',
    metrics: [
${study.metrics.map((metric) => `      { label: '${escapeString(metric.label)}', value: '${escapeString(metric.value)}' },`).join('\n')}
    ],
  },`
}

async function addCaseStudy() {
  console.log('🚀 Case Study Addition Tool')
  console.log('============================\n')

  const caseStudy: Partial<CaseStudy> = {}

  // Basic info
  console.log('📝 BASIC INFORMATION\n')
  caseStudy.title = await prompt('Title:')
  caseStudy.slug = await prompt(`Slug (default: ${slugify(caseStudy.title)}):`)
  if (!caseStudy.slug) {
    caseStudy.slug = slugify(caseStudy.title)
  }
  caseStudy.tagline = await prompt('Tagline:')
  caseStudy.industry = await prompt('Industry:')
  caseStudy.role = await prompt('Your Role:')

  // Frustration section
  console.log('\n😤 FRUSTRATION SECTION\n')
  caseStudy.personName = await prompt('Person Name (client/stakeholder):')
  caseStudy.personTitle = await prompt('Person Title:')
  caseStudy.companyName = await prompt('Company Name:')
  caseStudy.companyIndustry = await prompt('Company Industry:')
  caseStudy.problem = await promptMultiline('Problem (multiline):')
  caseStudy.impact = await promptMultiline('Impact (multiline):')

  // Fix section
  console.log('\n🔧 FIX SECTION\n')
  caseStudy.framework = await promptMultiline('Framework (multiline):')
  caseStudy.actions = await promptList('Actions (list):')
  caseStudy.outcomes = await promptList('Outcomes (list):')

  // Future section
  console.log('\n🔮 FUTURE SECTION\n')
  caseStudy.lesson = await promptMultiline('Lesson (multiline):')
  caseStudy.prescriptions = await promptList('Prescriptions (list):')

  // Meta
  console.log('\n🎨 METADATA\n')
  console.log(`Available colors: ${colors.join(', ')}`)
  caseStudy.color = await prompt('Color:')
  if (!colors.includes(caseStudy.color)) {
    console.log(`⚠️  Warning: '${caseStudy.color}' is not in the standard color list`)
  }

  caseStudy.metrics = await promptMetrics()

  // Generate ID based on existing case studies
  const caseStudiesPath = join(process.cwd(), 'src', 'data', 'caseStudies.ts')
  const fileContent = readFileSync(caseStudiesPath, 'utf-8')
  const idMatches = fileContent.match(/id: '(\d+)'/g)
  const maxId =
    idMatches && idMatches.length > 0
      ? Math.max(...idMatches.map((m) => Number.parseInt(m.match(/\d+/)?.[0] || '0')))
      : 0
  caseStudy.id = String(maxId + 1)

  // Confirmation
  console.log('\n📋 CASE STUDY PREVIEW\n')
  console.log(formatCaseStudy(caseStudy as CaseStudy))
  console.log('\n')

  const confirm = await prompt('Add this case study? (yes/no):')
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled')
    rl.close()
    return
  }

  // Add to file
  try {
    const insertPoint = fileContent.lastIndexOf(']')
    const newContent = `${
      fileContent.slice(0, insertPoint) + formatCaseStudy(caseStudy as CaseStudy)
    }\n${fileContent.slice(insertPoint)}`

    writeFileSync(caseStudiesPath, newContent, 'utf-8')

    console.log('\n✅ Case study added successfully!')
    console.log(`   ID: ${caseStudy.id}`)
    console.log(`   Slug: ${caseStudy.slug}`)
    console.log(`   File: ${caseStudiesPath}`)
  } catch (error) {
    console.error('\n❌ Error adding case study:', error)
    rl.close()
    process.exit(1)
  }

  rl.close()
}

addCaseStudy()

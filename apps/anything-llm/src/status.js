#!/usr/bin/env bun

/**
 * Check AnythingLLM Service Status
 */

const { execSync } = require('child_process')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const CONTAINER_NAME = 'anythingllm-local'
const PORT = 3102
const HEALTH_CHECK_URL = `http://localhost:${PORT}/api/ping`

async function checkStatus() {
  console.log(`${colors.blue}╔═══════════════════════════════════════╗${colors.reset}`)
  console.log(
    `${colors.blue}║${colors.reset}   AnythingLLM Status Check        ${colors.blue}║${colors.reset}`
  )
  console.log(`${colors.blue}╚═══════════════════════════════════════╝${colors.reset}\n`)

  // Check Docker
  try {
    execSync('docker --version', { stdio: 'ignore' })
    console.log(`${colors.green}✓${colors.reset} Docker: Available`)
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Docker: Not available`)
    return
  }

  // Check container exists
  try {
    const output = execSync(`docker ps -a --filter name=${CONTAINER_NAME} --format "{{.Names}}"`, {
      encoding: 'utf-8',
    }).trim()

    if (output !== CONTAINER_NAME) {
      console.log(`${colors.red}✗${colors.reset} Container: Not found`)
      console.log(
        `\n${colors.cyan}ℹ${colors.reset} Run ${colors.yellow}bun start${colors.reset} to create and start the container\n`
      )
      return
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Container: Error checking status`)
    return
  }

  // Check container running
  let isRunning = false
  try {
    const output = execSync(`docker ps --filter name=${CONTAINER_NAME} --format "{{.Names}}"`, {
      encoding: 'utf-8',
    }).trim()
    isRunning = output === CONTAINER_NAME
  } catch (error) {
    isRunning = false
  }

  if (!isRunning) {
    console.log(`${colors.yellow}⚠${colors.reset} Container: Stopped`)
    console.log(
      `\n${colors.cyan}ℹ${colors.reset} Run ${colors.yellow}bun start${colors.reset} to start the container\n`
    )
    return
  }

  console.log(`${colors.green}✓${colors.reset} Container: Running`)

  // Get container info
  try {
    const uptime = execSync(`docker ps --filter name=${CONTAINER_NAME} --format "{{.Status}}"`, {
      encoding: 'utf-8',
    }).trim()
    console.log(`${colors.cyan}ℹ${colors.reset} Uptime: ${uptime}`)
  } catch (error) {
    // Ignore
  }

  // Health check
  try {
    const response = await fetch(HEALTH_CHECK_URL)
    if (response.ok) {
      console.log(`${colors.green}✓${colors.reset} Health: Healthy`)
      console.log(
        `${colors.cyan}ℹ${colors.reset} URL: ${colors.blue}http://localhost:${PORT}${colors.reset}`
      )
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} Health: Unhealthy (HTTP ${response.status})`)
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Health: Not responding`)
    console.log(`${colors.cyan}ℹ${colors.reset} The service may still be starting up`)
  }

  // Show logs command
  console.log(`\n${colors.cyan}📋 Useful commands:${colors.reset}`)
  console.log(`   View logs: ${colors.yellow}bun run logs${colors.reset}`)
  console.log(`   Stop: ${colors.yellow}bun run stop${colors.reset}`)
  console.log(`   Restart: ${colors.yellow}bun run restart${colors.reset}`)
  console.log(`   Shell: ${colors.yellow}bun run shell${colors.reset}\n`)
}

checkStatus().catch((error) => {
  console.error(`${colors.red}✗${colors.reset} Error: ${error.message}`)
  process.exit(1)
})

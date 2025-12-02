#!/usr/bin/env bun

/**
 * AnythingLLM Service Manager
 *
 * Manages the AnythingLLM Docker container for the monorepo.
 * Provides health checks, automatic startup, and lifecycle management.
 */

const { execSync, spawn } = require('child_process')
const { existsSync } = require('fs')
const path = require('path')

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.warn(`${colors.yellow}⚠${colors.reset} ${msg}`),
}

const CONTAINER_NAME = 'anythingllm-local'
const PORT = 3102
const COMPOSE_FILE = path.join(__dirname, '../../../docker-compose.anythingllm.yml')
const HEALTH_CHECK_URL = `http://localhost:${PORT}/api/ping`
const MAX_STARTUP_TIME = 60000 // 60 seconds

/**
 * Check if Docker is available
 */
function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Check if container is running
 */
function isContainerRunning() {
  try {
    const output = execSync(`docker ps --filter name=${CONTAINER_NAME} --format "{{.Names}}"`, {
      encoding: 'utf-8',
    }).trim()
    return output === CONTAINER_NAME
  } catch (error) {
    return false
  }
}

/**
 * Check if container exists (running or stopped)
 */
function containerExists() {
  try {
    const output = execSync(`docker ps -a --filter name=${CONTAINER_NAME} --format "{{.Names}}"`, {
      encoding: 'utf-8',
    }).trim()
    return output === CONTAINER_NAME
  } catch (error) {
    return false
  }
}

/**
 * Health check
 */
async function healthCheck() {
  try {
    const response = await fetch(HEALTH_CHECK_URL)
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Wait for service to be healthy
 */
async function waitForHealthy(maxTime = MAX_STARTUP_TIME) {
  const startTime = Date.now()
  const checkInterval = 2000 // Check every 2 seconds

  log.info(`Waiting for AnythingLLM to be ready (max ${maxTime / 1000}s)...`)

  while (Date.now() - startTime < maxTime) {
    if (await healthCheck()) {
      return true
    }

    // Show progress
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    process.stdout.write(`\r${colors.cyan}⏳${colors.reset} Waiting... ${elapsed}s`)

    await new Promise((resolve) => setTimeout(resolve, checkInterval))
  }

  console.log('') // New line after progress
  return false
}

/**
 * Start the container
 */
function startContainer() {
  if (!existsSync(COMPOSE_FILE)) {
    log.error(`Docker Compose file not found: ${COMPOSE_FILE}`)
    process.exit(1)
  }

  log.info('Starting AnythingLLM container...')

  try {
    execSync(`docker compose -f "${COMPOSE_FILE}" up -d`, {
      stdio: 'inherit',
      cwd: path.dirname(COMPOSE_FILE),
    })
    return true
  } catch (error) {
    log.error('Failed to start container')
    return false
  }
}

/**
 * Stop the container
 */
function stopContainer() {
  log.info('Stopping AnythingLLM container...')

  try {
    execSync(`docker compose -f "${COMPOSE_FILE}" down`, {
      stdio: 'inherit',
      cwd: path.dirname(COMPOSE_FILE),
    })
    return true
  } catch (error) {
    log.error('Failed to stop container')
    return false
  }
}

/**
 * Show logs
 */
function showLogs() {
  log.info('Showing logs (Ctrl+C to exit)...\n')

  const logs = spawn('docker', ['logs', CONTAINER_NAME, '-f'], {
    stdio: 'inherit',
  })

  logs.on('error', (error) => {
    log.error(`Failed to show logs: ${error.message}`)
  })

  process.on('SIGINT', () => {
    logs.kill()
    process.exit(0)
  })
}

/**
 * Main startup logic
 */
async function main() {
  console.log(`${colors.blue}╔═══════════════════════════════════════╗${colors.reset}`)
  console.log(
    `${colors.blue}║${colors.reset}   AnythingLLM Service Manager      ${colors.blue}║${colors.reset}`
  )
  console.log(`${colors.blue}╚═══════════════════════════════════════╝${colors.reset}\n`)

  // Check Docker
  if (!checkDocker()) {
    log.error('Docker is not available. Please install Docker Desktop.')
    process.exit(1)
  }

  log.success('Docker is available')

  // Check container status
  const running = isContainerRunning()
  const exists = containerExists()

  if (running) {
    log.info('Container is already running')

    // Health check
    if (await healthCheck()) {
      log.success(`AnythingLLM is healthy at http://localhost:${PORT}`)
      console.log(`\n${colors.green}✓${colors.reset} Service is ready!`)
      console.log(
        `${colors.cyan}ℹ${colors.reset} Access UI: ${colors.blue}http://localhost:${PORT}${colors.reset}`
      )
      console.log(
        `${colors.cyan}ℹ${colors.reset} View logs: ${colors.yellow}bun run logs${colors.reset}`
      )
      console.log(
        `${colors.cyan}ℹ${colors.reset} Stop service: ${colors.yellow}bun run stop${colors.reset}\n`
      )
      return
    } else {
      log.warning('Container is running but not healthy. Restarting...')
      stopContainer()
    }
  } else if (exists) {
    log.info('Container exists but is stopped. Starting...')
  } else {
    log.info('Container does not exist. Creating and starting...')
  }

  // Start container
  if (!startContainer()) {
    log.error('Failed to start AnythingLLM')
    process.exit(1)
  }

  // Wait for healthy
  const healthy = await waitForHealthy()

  if (healthy) {
    console.log('') // New line
    log.success(`AnythingLLM is ready at http://localhost:${PORT}`)
    console.log(`\n${colors.green}✓${colors.reset} Service started successfully!`)
    console.log(
      `${colors.cyan}ℹ${colors.reset} Access UI: ${colors.blue}http://localhost:${PORT}${colors.reset}`
    )
    console.log(
      `${colors.cyan}ℹ${colors.reset} View logs: ${colors.yellow}bun run logs${colors.reset}`
    )
    console.log(
      `${colors.cyan}ℹ${colors.reset} Stop service: ${colors.yellow}bun run stop${colors.reset}`
    )
    console.log(`\n${colors.cyan}📚 First-time setup:${colors.reset}`)
    console.log(`   1. Create admin password`)
    console.log(`   2. Set LLM Provider: Groq`)
    console.log(`   3. Enter Groq API key`)
    console.log(`   4. Create workspace: "leadership-blog-content"`)
    console.log(`   5. Upload documents from knowledge-base/\n`)
  } else {
    log.error('AnythingLLM failed to start within timeout')
    log.info('Check logs with: bun run logs')
    process.exit(1)
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  log.error(`Uncaught error: ${error.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled rejection: ${error.message}`)
  process.exit(1)
})

// Run
main()

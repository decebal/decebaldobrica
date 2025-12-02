#!/usr/bin/env bun

/**
 * Stop AnythingLLM Service
 */

const { execSync } = require('child_process')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
}

const COMPOSE_FILE = path.join(__dirname, '../../../docker-compose.anythingllm.yml')

function stopService() {
  log.info('Stopping AnythingLLM service...')

  try {
    execSync(`docker compose -f "${COMPOSE_FILE}" down`, {
      stdio: 'inherit',
      cwd: path.dirname(COMPOSE_FILE),
    })
    log.success('AnythingLLM stopped successfully')
    return true
  } catch (error) {
    log.error('Failed to stop AnythingLLM')
    return false
  }
}

stopService()

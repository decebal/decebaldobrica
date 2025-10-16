# Task Files Organization

This directory contains modular task definitions for the Portfolio Monorepo Taskfile.

## Structure

```
tooling/tasks/
├── development.yml    # Dev server, dependencies, cleanup
├── build.yml          # Production builds
├── quality.yml        # Linting, formatting, type-checking
├── testing.yml        # E2E tests (Playwright)
├── database.yml       # Database management
├── analytics.yml      # Analytics & monitoring
├── packages.yml       # Package-specific tasks (crypto-subscriptions, email, newsletter)
└── deployment.yml     # Deployment tasks
```

## Usage

### From Root

All tasks are available from the monorepo root:

```bash
# Development
task dev:dev           # Start dev server
task dev:install       # Install dependencies
task dev:clean         # Clean build artifacts

# Packages
task pkg:crypto:test           # Test crypto-subscriptions
task pkg:crypto:test:unit      # Unit tests only
task pkg:crypto:test:e2e       # E2E tests only
task pkg:crypto:build          # Build package
task pkg:packages:build        # Build all packages

# Quality
task quality:lint              # Run linter
task quality:check:all         # All checks

# Testing
task test:test:e2e             # Run E2E tests

# Database
task db:stats                  # Show DB stats
task db:backup                 # Backup database

# Analytics
task analytics:payment:stats   # Payment statistics

# Deployment
task deploy:deploy:vercel:prod # Deploy to production
```

### Aliases

Short aliases are available:

```bash
task p:crypto:test     # Same as pkg:crypto:test
task q:lint            # Same as quality:lint
task t:test:e2e        # Same as test:test:e2e
task a:payment:stats   # Same as analytics:payment:stats
```

## Adding New Tasks

### 1. Choose the right file

- **development.yml** - Development environment, dependencies
- **build.yml** - Build processes
- **quality.yml** - Code quality checks
- **testing.yml** - Test execution
- **database.yml** - Database operations
- **analytics.yml** - Monitoring & stats
- **packages.yml** - Package-specific tasks
- **deployment.yml** - Deployment workflows

### 2. Add your task

```yaml
# In appropriate file, e.g., packages.yml
your-package:task:
  desc: Description of what it does
  dir: packages/your-package  # Optional: change directory
  cmds:
    - bun run your-command
```

### 3. Use from root

```bash
task pkg:your-package:task
```

## Package Tasks Pattern

For packages, use this naming pattern:

```yaml
<package-name>:<action>:
  desc: <Action> <package name>
  dir: packages/<package-name>
  cmds:
    - bun run <script>
```

Example:
```yaml
crypto:test:unit:
  desc: Run crypto-subscriptions unit tests
  dir: packages/crypto-subscriptions
  cmds:
    - bun test:unit
```

## Best Practices

1. **Descriptive names**: Use clear, action-oriented task names
2. **Good descriptions**: Write helpful `desc` fields
3. **Group related tasks**: Keep similar tasks in the same file
4. **Use dir**: Set working directory for package tasks
5. **Chain tasks**: Use `task:` in cmds to call other tasks
6. **Prompts for destructive actions**: Use `prompt:` for dangerous operations

## Quick Reference

| Area | Tasks | Example |
|------|-------|---------|
| Development | dev:* | `task dev:dev` |
| Build | build:* | `task build:build` |
| Quality | quality:* | `task quality:lint` |
| Testing | test:* | `task test:test:e2e` |
| Database | db:* | `task db:stats` |
| Analytics | analytics:* | `task analytics:summary` |
| Packages | pkg:* | `task pkg:crypto:test` |
| Deployment | deploy:* | `task deploy:deploy:vercel:prod` |

## Common Workflows

### Start Development
```bash
task dev:install
task dev:dev
```

### Before Commit
```bash
task quality:check:all
task pkg:crypto:test
```

### Build for Production
```bash
task pkg:packages:build
task build:build
```

### Test Crypto Package
```bash
task pkg:crypto:test:unit        # Fast unit tests
task pkg:crypto:test:integration # Integration tests
task pkg:crypto:test:e2e         # Full E2E tests
task pkg:crypto:test:coverage    # With coverage
```

### Publish Package
```bash
task pkg:crypto:check            # All checks
task pkg:crypto:publish:dry      # Dry run
task pkg:crypto:publish          # Actual publish
```

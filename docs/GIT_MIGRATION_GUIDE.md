# Git Migration Guide: Monorepo Transition

**Goal:** Replace the old standalone repo with the new monorepo as the main codebase

**Old Repo:** `/Users/decebaldobrica/Projects/personal/portofolio-nextjs`
**New Repo:** `/Users/decebaldobrica/Projects/personal/portofolio-monorepo`

---

## ✅ Recommended Approach: Clean Branch Replacement

This preserves git history while clearly marking the monorepo migration.

### Step 1: Check Current Status

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# Check git status
git status

# Check current branch
git branch

# Check remotes
git remote -v
```

### Step 2: Add Remote from Old Repo

```bash
# Add the old repo as a remote
git remote add old-repo /Users/decebaldobrica/Projects/personal/portofolio-nextjs

# Fetch all branches and history
git fetch old-repo

# Verify
git remote -v
```

### Step 3: Create Migration Commit

```bash
# Make sure all monorepo files are committed
git add .
git status

# Create a comprehensive migration commit
git commit -m "feat: migrate to monorepo architecture

BREAKING CHANGE: Project restructured as Turborepo monorepo

## Migration Summary

- Extracted 5 shared packages (ui, database, newsletter, analytics, email)
- Moved main app to apps/web
- Updated 182 imports across 80 files
- Configured Turborepo with build pipeline
- Set up workspace dependencies with Bun

## Packages Created

- @decebal/ui - 54+ shadcn/ui components
- @decebal/database - Supabase client & utilities
- @decebal/newsletter - Newsletter subscription logic
- @decebal/analytics - PostHog integration
- @decebal/email - Email templates structure

## Benefits

- Shared code across future apps
- Turborepo caching for faster builds
- Better code organization
- Ready for newsletter admin app
- Scalable architecture

## Documentation

- MIGRATION_COMPLETE.md - Migration summary
- NEWSLETTER_REMAINING_WORK.md - Remaining work
- docs/ - All detailed documentation

Migration completed on: $(date +%Y-%m-%d)
Migrated from: portofolio-nextjs (commit: $(cd /Users/decebaldobrica/Projects/personal/portofolio-nextjs && git rev-parse HEAD))

Co-authored-by: Claude <noreply@anthropic.com>"
```

### Step 4: Handle Remote Repository

**Option A: Replace Main Branch (Clean Transition)**

```bash
# IMPORTANT: This will replace the main branch history
# Make sure you have backups!

# Push to main with force (overwrites remote)
git push origin main --force

# Verify on GitHub/remote
```

**Option B: Create New Branch First (Safer)**

```bash
# Create a new branch for the monorepo
git checkout -b monorepo-migration

# Push the new branch
git push origin monorepo-migration

# Create a Pull Request on GitHub
# Review changes, then merge to main
# This allows you to review before replacing main
```

**Option C: Keep Old History and Merge**

```bash
# Merge old repo history into monorepo
git merge old-repo/main --allow-unrelated-histories -m "chore: merge old repo history before monorepo migration"

# Create migration commit (as in Step 3)
git add .
git commit -m "feat: migrate to monorepo architecture..."

# Push to main
git push origin main
```

---

## 🎯 Recommended Flow (Step by Step)

### 1. Verify Monorepo is Ready

```bash
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# Test build
bun run build:web

# Test dev server
bun run dev:web

# Run linting
bun run lint

# If all passes, you're ready!
```

### 2. Commit All Monorepo Changes

```bash
# Check what needs to be committed
git status

# Add all files
git add .

# Create migration commit (see Step 3 above)
git commit -m "feat: migrate to monorepo architecture..."
```

### 3. Link to Old Repo (Preserve History)

```bash
# Add old repo as remote
git remote add old-repo /Users/decebaldobrica/Projects/personal/portofolio-nextjs

# Fetch old history
git fetch old-repo

# Optional: Merge old history
git merge old-repo/main --allow-unrelated-histories -m "chore: preserve git history from standalone repo"
```

### 4. Push to Remote

**Safe approach (recommended for first time):**

```bash
# Create backup branch
git branch backup-before-monorepo

# Push backup
git push origin backup-before-monorepo

# Create monorepo branch
git checkout -b monorepo-migration

# Push monorepo branch
git push origin monorepo-migration

# Now go to GitHub and:
# 1. Review the changes in the PR
# 2. Merge to main when ready
# 3. Update default branch if needed
```

**Direct approach (if you're confident):**

```bash
# Push directly to main (overwrites)
git push origin main --force-with-lease

# The --force-with-lease is safer than --force
# It will fail if someone else pushed in the meantime
```

---

## 🔄 After Migration

### Update Local Working Directory

```bash
# Set the monorepo as your primary working directory
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# Add this to your shell config (~/.zshrc or ~/.bashrc)
alias cdportfolio="cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo"
```

### Archive Old Repo

```bash
# Rename old directory to indicate it's archived
mv /Users/decebaldobrica/Projects/personal/portofolio-nextjs \
   /Users/decebaldobrica/Projects/personal/portofolio-nextjs-archived-$(date +%Y%m%d)

# Or create a backup tarball
cd /Users/decebaldobrica/Projects/personal
tar -czf portofolio-nextjs-backup-$(date +%Y%m%d).tar.gz portofolio-nextjs

# Then delete the old directory
rm -rf portofolio-nextjs
```

### Update Vercel/Deployment

If you're using Vercel:

1. **Go to your project settings**
2. **Update Root Directory:** Leave blank (monorepo root)
3. **Build settings:**
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && bun run build:web`
   - Output Directory: `apps/web/.next`
   - Install Command: `bun install`

4. **Environment Variables:** Already copied to `apps/web/.env.local`

---

## 🆘 Troubleshooting

### Lost Commits?

```bash
# Git never truly deletes commits
# Find lost commits
git reflog

# Recover a commit
git checkout <commit-hash>
git checkout -b recovery-branch
```

### Need to Undo Force Push?

```bash
# On GitHub, check previous commits
# Find the commit hash before force push
# Force push back to that commit
git reset --hard <old-commit-hash>
git push origin main --force
```

### Merge Conflicts?

```bash
# If merging old history creates conflicts
git merge --abort

# Try with strategy
git merge old-repo/main --allow-unrelated-histories --strategy-option theirs
```

---

## 📋 Pre-Migration Checklist

Before pushing to remote:

- [ ] Monorepo builds successfully (`bun run build:web`)
- [ ] Dev server works (`bun run dev:web`)
- [ ] All tests pass (`bun run test:e2e`)
- [ ] Environment variables copied to `apps/web/.env.local`
- [ ] All files committed (`git status` shows clean)
- [ ] Backup branch created
- [ ] Remote is correct (`git remote -v`)
- [ ] Team notified (if applicable)

---

## 🎯 Recommended Command Sequence

Here's the exact sequence I recommend:

```bash
# 1. Navigate to monorepo
cd /Users/decebaldobrica/Projects/personal/portofolio-monorepo

# 2. Check everything is committed
git status
git add .
git commit -m "feat: migrate to monorepo architecture

BREAKING CHANGE: Project restructured as Turborepo monorepo

See MIGRATION_COMPLETE.md for full details.
"

# 3. Test build
bun run build:web

# 4. Create backup
git branch backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)

# 5. Add old repo remote (preserve history)
git remote add old-repo /Users/decebaldobrica/Projects/personal/portofolio-nextjs
git fetch old-repo

# 6. Merge old history (optional but recommended)
git merge old-repo/main --allow-unrelated-histories -m "chore: preserve git history from standalone repo"

# 7. Push to main
git push origin main --force-with-lease

# 8. Verify on GitHub
# Open your repo URL in browser and verify

# 9. Update Vercel deployment settings
# Follow "Update Vercel/Deployment" section above

# 10. Archive old repo
mv /Users/decebaldobrica/Projects/personal/portofolio-nextjs \
   /Users/decebaldobrica/Projects/personal/portofolio-nextjs-archived-$(date +%Y%m%d)
```

---

## 🎉 Success!

After following these steps:

✅ Your monorepo is now the main codebase
✅ Git history is preserved (if you merged)
✅ Old repo is safely archived
✅ Deployment is updated
✅ You can continue developing in the monorepo

**Next:** Start building Phase 2 of the newsletter system!

---

## 📝 Notes

**Why `--force-with-lease` instead of `--force`?**
- `--force-with-lease` is safer
- It checks that no one else pushed in the meantime
- Prevents accidentally overwriting others' work

**Should I merge old history?**
- Yes, if you want to preserve commit history
- No, if you want a clean break (monorepo is the new start)
- Either way is valid, depends on your preference

**What about the old repo?**
- Keep it archived for reference
- Don't delete immediately
- Can remove after a few weeks of successful monorepo usage

---

**Need help?** Let me know if you encounter any issues during the migration!

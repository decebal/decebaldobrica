# Development Standards

This document defines the standards for task completion and readiness in the Next.js Portfolio project.

## 📋 Definition of Done (DoD)

A task is considered **DONE** when ALL of the following criteria are met:

### Required Quality Gates:
1. **✅ Type check passes**: `task type-check` completes without TypeScript errors
2. **✅ Build passes**: `task build` completes successfully without errors
3. **✅ E2E tests pass**: `task test:e2e` runs successfully with all tests passing
4. **✅ Lint passes**: `task lint` completes without errors (warnings are acceptable)
5. **✅ No mocked data in production**: API endpoints and Server Actions must not serve hardcoded/mocked data in production code paths

### Additional Quality Gates:
- Code compiles without TypeScript errors
- No blocking issues that prevent the feature from functioning
- All critical functionality implemented as specified
- Documentation updated if new APIs, Server Actions, or significant changes are introduced
- Proper client/server component boundaries (correct 'use client' directives)
- No React hydration mismatches
- Graceful error handling with appropriate fallbacks
- Toast notifications for user-facing errors where appropriate

---

## 📋 Definition of Ready (DoR)

A task is considered **READY TO BE PICKED UP** when ALL of the following criteria are met:

### Required Readiness Criteria:
1. **✅ E2E testable**: A comprehensive end-to-end test can be written and executed
2. **✅ Clear instructions**: The task description provides specific, actionable steps
3. **✅ Clear references**: All necessary code locations, files, and dependencies are identified
4. **✅ No ambiguity**: Requirements are unambiguous and complete

### If a task is NOT ready:
- **Ask clarifying questions** until all ambiguities are resolved
- **Request specific examples** if the scope is unclear
- **Identify missing references** (files, functions, endpoints, etc.)
- **Confirm expected behavior** for edge cases and error scenarios

---

## 🔄 Task Workflow

```
[Task Request] → [Assess DoR] → [Ask Questions if needed] → [Execute] → [Verify DoD] → [DONE]
                      ↓
              [If not ready: Ask clarifying questions]
```

## 🎯 Quality Standards

### Code Quality:
- Follow existing code conventions and patterns
- Use Biome formatter settings (single quotes, 2-space indent, 100 char line width)
- Implement proper error handling with try/catch and toast notifications
- Use appropriate logging levels (console.error for errors, avoid console.log in production)
- Maintain strict TypeScript type safety
- Follow Next.js 15 patterns (Server Components by default, 'use client' only when needed)
- Use Server Actions for data mutations instead of API routes when possible
- Follow SOLID principles where applicable

### Testing Standards:
- E2E tests for critical user paths (Playwright)
- E2E tests should verify no console errors or React errors
- Test components with client-side state (useState, useEffect)
- Test Server Actions for proper error handling
- Mock external services appropriately (AI, Solana, database)
- Test error scenarios and edge cases
- Test across multiple browsers and devices

### Documentation Standards:
- Update relevant documentation for new features
- Include inline code comments for complex logic
- Document Server Actions with JSDoc comments
- Update CLAUDE.md for significant architectural changes
- Update README files when necessary

---

## 📝 Verification Checklist

Before marking any task as DONE, verify:

- [ ] `task type-check` passes without TypeScript errors
- [ ] `task build` completes successfully
- [ ] `task test:e2e` runs with all tests passing
- [ ] `task lint` completes without errors
- [ ] **No mocked data served in production API endpoints or Server Actions**
- [ ] Proper 'use client' directives for components using React hooks
- [ ] No hydration mismatches (check browser console)
- [ ] Feature works as specified
- [ ] Error cases are handled gracefully with toast notifications
- [ ] Code follows project conventions (Biome rules: single quotes, 2-space indent)
- [ ] Documentation is updated if needed

---

*This document should be consulted before starting any development task and before marking any task as complete.*
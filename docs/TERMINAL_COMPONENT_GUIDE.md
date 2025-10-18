# Terminal Component Guide

The Terminal component allows you to display beautiful, interactive terminal output in your blog posts.

## Basic Usage

In your MDX blog posts, use triple backticks with the `terminal`, `bash`, `shell`, or `console` language identifier:

````markdown
```terminal
# Installing Dependencies
$ npm install next@latest react@latest

✅ added 342 packages in 8s
```
````

## Syntax

### Commands

Lines starting with `$` or `>` are automatically styled as commands:

````markdown
```terminal
$ npm run build
> Building application...
```
````

### Output Types

The terminal automatically detects and styles different output types:

#### Success Output
Use `✓`, `✅`, or include "success" in the line:

````markdown
```terminal
$ npm test
✅ All tests passed
✓ 42 tests completed
Test suite completed successfully
```
````

#### Error Output
Use `✗`, `❌`, or include "error" in the line:

````markdown
```terminal
$ npm start
❌ Failed to start server
✗ Port 3000 is already in use
Error: EADDRINUSE
```
````

#### Warning Output
Use `⚠` or include "warning" in the line:

````markdown
```terminal
$ npm install
⚠ deprecated package@1.0.0
warning: peer dependency not met
```
````

#### Regular Output
All other lines are displayed as regular terminal output:

````markdown
```terminal
$ ls -la
total 48
drwxr-xr-x  12 user  staff   384 Oct 17 15:30 .
drwxr-xr-x   8 user  staff   256 Oct 17 15:00 ..
-rw-r--r--   1 user  staff  1024 Oct 17 15:30 README.md
```
````

## Custom Title

Add a title to your terminal by starting with a comment line:

````markdown
```terminal
# Development Server
$ npm run dev

> Server running on http://localhost:3100
✅ Ready in 2.3s
```
````

The first line starting with `#` will be used as the terminal title.

## Complete Example

Here's a complete example showing different features:

````markdown
```terminal
# Building and Deploying
$ npm run build

> next build
> Analyzing bundles...

✅ Build completed successfully
   - Pages: 25
   - Static: 18
   - Serverless: 7

$ npm run deploy

> Deploying to production...
⚠ Warning: Large bundle size detected
  Consider code splitting for /dashboard

✅ Deployment successful
   URL: https://yourapp.com
   Deploy ID: abc123
```
````

This renders as:

![Terminal Example](terminal-example.png)

## Advanced Usage

### Multiple Commands in Sequence

Show a complete workflow:

````markdown
```bash
# Complete Setup Process
$ git clone https://github.com/user/repo.git
Cloning into 'repo'...
✅ Repository cloned

$ cd repo

$ npm install
⚠ Found 2 high severity vulnerabilities
   Run npm audit fix
✅ Dependencies installed

$ npm run dev
> Server starting...
✅ Server running on http://localhost:3100
```
````

### Build Output

````markdown
```console
# Production Build
$ npm run build

> Creating optimized production build...

Route (app)                              Size     First Load JS
┌ ○ /                                    2.1 kB         120 kB
├ ○ /_not-found                          900 B          100 kB
├ ○ /blog                                3.4 kB         125 kB
└ ○ /blog/[slug]                         5.2 kB         130 kB

○  (Static)  automatically rendered as static HTML

✅ Build completed in 45s
```
````

### Error Debugging

````markdown
```terminal
# Debugging Application Error
$ npm run test:e2e

> Running end-to-end tests...

❌ Test failed: Login flow
   Expected status 200, received 401

$ cat logs/error.log
Error: Authentication failed
  at authenticate (auth.ts:42)
  at login (routes.ts:15)

$ npm run debug
> Starting debug session...
Debugger listening on port 9229
```
````

### Docker Commands

````markdown
```bash
# Docker Deployment
$ docker build -t myapp:latest .
[+] Building 45.2s (12/12) FINISHED
✅ Image built successfully

$ docker run -p 3000:3000 myapp:latest
> Starting container...
> Server listening on port 3000
✅ Container running

$ docker ps
CONTAINER ID   IMAGE           STATUS
a1b2c3d4e5f6   myapp:latest    Up 2 minutes
```
````

## Styling Reference

The Terminal component uses these color schemes:

- **Command lines** (`$`, `>`): White text, bold
- **Success** (`✓`, `✅`, "success"): Green (#10b981)
- **Error** (`✗`, `❌`, "error"): Red (#ef4444)
- **Warning** (`⚠`, "warning"): Yellow (#f59e0b)
- **Regular output**: Light gray (#d1d5db)
- **Background**: Dark gray (#111827)

## Features

- ✅ **Copy to clipboard**: Click copy button in header
- ✅ **Expand/Minimize**: Toggle full-screen mode
- ✅ **Syntax highlighting**: Auto-detects command vs output
- ✅ **macOS style**: Traffic light buttons, clean design
- ✅ **Responsive**: Works on mobile and desktop

## Tips

1. **Use realistic output**: Copy actual terminal output for authenticity
2. **Include context**: Add comments or titles to explain what's happening
3. **Show the full workflow**: Include setup, execution, and results
4. **Highlight key information**: Use success/error markers for important lines
5. **Keep it readable**: Don't include too much output, focus on relevant parts

## Fallback

If the Terminal component isn't available, the code block will still render as a standard syntax-highlighted code block, ensuring your content is always readable.

## Browser Support

The Terminal component works in all modern browsers:
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Examples in the Wild

Check these blog posts for real-world examples:
- "Building Newsletter System in 48 Hours" - Installation and deployment
- "Optimizing Rust API Performance" - Benchmarking and profiling
- "Docker for the Simple Programmer" - Docker commands and output

---

**Need help?** The Terminal component automatically handles most cases. Just use triple backticks with `terminal`, `bash`, `shell`, or `console` and write your terminal session naturally!

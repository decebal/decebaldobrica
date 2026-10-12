# Rust & AI Weekly #16: connected X thread

Status: unpublished. Publish as one connected thread after approval and canonical deployment.

## 1

An MCP resource error could trigger a protocol fallback. rmcp 3.5.1 fixes the HTTP mapping behind it.

Rust & AI Weekly #16 covers that patch, mold's Rust rewrite and tool outputs worth inspecting before rollout. 1/7

## 2

rmcp previously mapped every -32602 error to HTTP 400. A compatible client could interpret a missing resource as a reason to fall back to initialize.

Test an unsuccessful call through the deployed transport. Record status, body and fallback. 2/7

## 3

The patch adds a credential-store callback for rejected refresh tokens. Its default is a no-op.

Your store needs a retirement policy. Test rejection, temporary provider failure and callback failure. rmcp remains Trial. 3/7

## 4

mold 3.0 is the first Rust release. Building now uses Cargo, Rust 1.95+ and a C compiler.

Upstream reports compatibility and performance parity. I haven't reproduced those results. Check installed packaging and resulting binaries. Trial. 4/7

## 5

GitHub MCP Server 2.0 adds structured output schemas, advertised only to MCP 2026-07-28+ clients.

The negotiated peer matters. Start with a scoped read-only inventory and inspect actual responses. This Go server is a Rust-agent peer. Trial. 5/7

## 6

Fullbleed 2.5.22 fixes floated first-letter PDF layout. Its release evidence retains source-corpus failures and separates package checks.

Assess: inspect your actual PDF's text, pages and fonts. No full CSS-parity claim; no independent reproduction. 6/7

## 7

Also: experimental Generic Const Args and merged Cargo changes whose shipped release still needs checking.

Read #16:
https://decebaldobrica.com/blog/2026-10-12-rust-ai-weekly-16

Which peer versions are you testing? 7/7

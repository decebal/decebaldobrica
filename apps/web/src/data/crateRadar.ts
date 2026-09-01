// Rust & AI Crate Radar — data source for the /radar page.
//
// This file is the on-site snapshot of the tools featured across the blog &
// newsletter. It is meant to be regenerated from AllSource Prime (the
// `tool` nodes, domain `rust-ai`) as part of the publish flow — see
// docs/SOCIAL_POSTING_SETUP.md / the rust-ai-weekly-roundup skill. Until the
// generator is wired, update it here when an issue ships.
//
// Rings are the editorial verdict (ThoughtWorks Tech Radar vocabulary):
//   Adopt  — proven, safe to standardize on
//   Trial  — worth using on real work, with eyes open
//   Assess — promising; explore before betting
//   Hold   — proceed with caution / don't newly depend yet

export type RadarRing = 'Adopt' | 'Trial' | 'Assess' | 'Hold'
export type RadarQuadrant = 'agentic' | 'inference' | 'data' | 'dev'

export interface RadarTool {
  name: string
  url: string
  category: string
  quadrant: RadarQuadrant
  ring: RadarRing
  maintenance: string
  latest: string
  stars?: string
  downloads?: string
  adopters?: string
  mentions: string
  /** true if featured in more than one issue/article */
  returning: boolean
  note?: string
}

export const RADAR_GENERATED_AT = '2026-08-31'

/** Issue number shown in the generated radar image subtitle. Bump per issue. */
export const RADAR_ISSUE = 10

export const RADAR_QUADRANTS: { key: RadarQuadrant; label: string }[] = [
  { key: 'agentic', label: 'Agentic & LLM' },
  { key: 'inference', label: 'Inference & Serving' },
  { key: 'data', label: 'Data & Search' },
  { key: 'dev', label: 'Dev Tools & Editors' },
]

export const RADAR_RINGS: RadarRing[] = ['Adopt', 'Trial', 'Assess', 'Hold']

export const crateRadarTools: RadarTool[] = [
  // ── Agentic & LLM ──
  {
    name: 'goose', url: 'https://github.com/block/goose', category: 'agentic', quadrant: 'agentic',
    ring: 'Adopt', maintenance: 'very actively maintained (Block-backed, 400+ contributors)',
    latest: 'v1.29.1 (Apr 2026)', stars: '~35k★', adopters: 'Block (internal use)',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
    note: 'Rust-core agent/CLI; desktop UI is TypeScript',
  },
  {
    name: 'rmcp', url: 'https://github.com/modelcontextprotocol/rust-sdk', category: 'agentic', quadrant: 'agentic',
    ring: 'Adopt', maintenance: 'actively maintained (official MCP org)', latest: 'v1.7.0 (May 2026)',
    stars: '~3.4k★', downloads: '~13M', adopters: 'canonical Rust MCP SDK',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'rig', url: 'https://github.com/0xPlaygrounds/rig', category: 'agentic', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively maintained', latest: 'rig-core 0.38.2 (Jun 2026)',
    stars: '~7k★', downloads: '~1.2M', adopters: 'Neon, St. Jude, Nethermind, Dria, Coral Protocol',
    mentions: 'Crate Radar (2026-06-18); Rust & AI Weekly #2 (2026-06-22)', returning: true,
  },
  {
    name: 'genai', url: 'https://github.com/jeremychone/rust-genai', category: 'agentic/client', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively maintained (solo maintainer — bus-factor)', latest: 'v0.6.0 (May 2026)',
    stars: '~800★', adopters: "AIPack (author's tooling); 25+ providers",
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'async-openai', url: 'https://github.com/64bit/async-openai', category: 'agentic/client', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively maintained (solo)', latest: 'v0.41.0 (Jun 2026)',
    stars: '~1.9k★', downloads: '~5.7M', adopters: 'de-facto OpenAI client across ecosystem',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'swiftide', url: 'https://github.com/bosun-ai/swiftide', category: 'agentic/RAG', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'maintained, pre-1.0, small team', latest: 'v0.32.1 (Nov 2025)',
    stars: '~710★', downloads: '~82k', adopters: 'bosun.ai (primary)',
    mentions: 'Crate Radar (2026-06-18); Rust & AI Weekly #2 (2026-06-22)', returning: true,
  },
  {
    name: 'kalosm', url: 'https://github.com/floneum/floneum', category: 'agentic/local-models', quadrant: 'agentic',
    ring: 'Hold', maintenance: 'slowing — mid-rewrite (WGPU backend)', latest: 'v0.4.0 (Feb 2025)',
    stars: '~2.2k★', adopters: 'none named',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false, note: 'experimental',
  },
  {
    name: 'AutoAgents', url: 'https://github.com/liquidos-ai/AutoAgents', category: 'agentic', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'actively developed (liquidos-ai)', latest: 'active 2026',
    adopters: 'benchmark-led; autoagents-py on PyPI',
    mentions: 'Rust & AI Weekly #2 (2026-06-22)', returning: false,
    note: 'multi-agent; <1.1GB peak vs Python >4.7GB; reportedly ~43% lower latency than LangGraph',
  },
  {
    name: 'rs-graph-llm', url: 'https://github.com/a-agmon/rs-graph-llm', category: 'agentic/workflows', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'actively maintained (solo — bus-factor)', latest: 'v1.4.2',
    adopters: 'one named logistics deployment (reported 99.99% uptime)',
    mentions: 'Rust & AI Weekly #2 (2026-06-22)', returning: false,
    note: 'graph-based multi-agent workflows with distributed execution',
  },

  // ── Inference & Serving ──
  {
    name: 'candle', url: 'https://github.com/huggingface/candle', category: 'inference', quadrant: 'inference',
    ring: 'Adopt', maintenance: 'actively maintained (Hugging Face)', latest: 'candle-core 0.10.2 (Apr 2026)',
    stars: '~20k★', adopters: 'anchors mistral.rs, kalosm; Hugging Face',
    mentions: 'Crate Radar (2026-06-18); Rust & AI Weekly #2 (2026-06-22)', returning: true,
  },
  {
    name: 'ort', url: 'https://github.com/pykeio/ort', category: 'inference', quadrant: 'inference',
    ring: 'Adopt', maintenance: 'actively maintained', latest: 'v2.0.0-rc.12 (Mar 2026; pre-1.0 API)',
    downloads: '~10.8M', adopters: 'Twitter/X, SurrealDB, Bloop, Google Magika, Wasmtime',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'tract', url: 'https://github.com/sonos/tract', category: 'inference', quadrant: 'inference',
    ring: 'Adopt', maintenance: 'actively maintained (Sonos)', latest: 'v0.21.15 (Mar 2026)',
    stars: '~2.9k★', downloads: 'sub-crates ~1M each', adopters: 'Sonos (wake-word + ASR on millions of devices)',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'mistral.rs', url: 'https://github.com/EricLBuehler/mistral.rs', category: 'inference', quadrant: 'inference',
    ring: 'Trial', maintenance: 'actively maintained — high velocity, single maintainer (bus-factor)', latest: 'v0.8.2 (2026)',
    stars: '~6.5k★', adopters: 'none named',
    mentions: 'Crate Radar (2026-06-18); Rust & AI Weekly #2 (2026-06-22)', returning: true,
  },
  {
    name: 'llama-cpp-2', url: 'https://github.com/utilityai/llama-cpp-rs', category: 'inference', quadrant: 'inference',
    ring: 'Trial', maintenance: 'actively maintained, tracks upstream llama.cpp (no semver — pin)', latest: '0.1.146 (Apr 2026)',
    stars: '~580★', downloads: 'llama-cpp-sys-2 ~655k', adopters: 'UtilityAI',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'burn', url: 'https://github.com/tracel-ai/burn', category: 'inference/training', quadrant: 'inference',
    ring: 'Assess', maintenance: 'actively maintained (Tracel AI)', latest: 'v0.20.0 (Jan 2026, CubeK)',
    stars: '~15k★', adopters: 'none named',
    mentions: 'Crate Radar (2026-06-18); Rust & AI Weekly #2 (2026-06-22)', returning: true,
  },
  {
    name: 'luminal', url: 'https://github.com/luminal-ai/luminal', category: 'inference/training', quadrant: 'inference',
    ring: 'Assess', maintenance: 'actively developed via main (release tags lag; pre-1.0)', latest: 'active commits mid-2026 (last tag 0.2)',
    stars: '~2.9k★', adopters: 'YC S25, $5.3M seed; research use at Yale',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false, note: 'one-to-watch / pre-1.0',
  },
  {
    name: 'cuTile Rust', url: 'https://arxiv.org/abs/2606.15991', category: 'inference/GPU', quadrant: 'inference',
    ring: 'Assess', maintenance: 'research artifact (arXiv, Jun 2026)', latest: 'paper + early code',
    adopters: 'none yet',
    mentions: 'Rust & AI Weekly #2 (2026-06-22)', returning: false,
    note: 'memory-safe, data-race-free GPU kernels in Rust (B200 benchmarks) — watch-this-space, not yet a crate',
  },

  // ── Data & Search ──
  {
    name: 'qdrant', url: 'https://github.com/qdrant/qdrant', category: 'data/vectors', quadrant: 'data',
    ring: 'Adopt', maintenance: 'actively maintained', latest: 'v1.17.1 (Mar 2026)',
    stars: '~31k★', adopters: 'Tripadvisor, HubSpot; Qdrant Cloud',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'lancedb', url: 'https://github.com/lancedb/lancedb', category: 'data/vectors', quadrant: 'data',
    ring: 'Adopt', maintenance: 'very actively maintained, nearing 1.0', latest: 'v0.33.x beta (Jun 2026)',
    stars: '~10.5k★', adopters: 'Netflix, CodeRabbit; Cloud/Enterprise',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
    note: 'Rust-core (Lance format) with Python/JS/Java bindings',
  },
  {
    name: 'tantivy', url: 'https://github.com/quickwit-oss/tantivy', category: 'data/search', quadrant: 'data',
    ring: 'Adopt', maintenance: 'actively maintained (Quickwit)', latest: 'v0.26.x (2026)',
    downloads: 'sub-crates ~10M each', adopters: 'Quickwit, ParadeDB',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'fastembed-rs', url: 'https://github.com/Anush008/fastembed-rs', category: 'data/embeddings', quadrant: 'data',
    ring: 'Trial', maintenance: 'actively maintained (frequent releases)', latest: 'v5.17.2 (Jun 2026)',
    stars: '~900★', downloads: '~1.5M', adopters: 'integrates with rig',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'Stoolap', url: 'https://github.com/stoolap/stoolap', category: 'data/vectors', quadrant: 'data',
    ring: 'Assess', maintenance: 'actively maintained but early/pre-1.0', latest: 'v0.3.1 (2026)',
    stars: '~540★', adopters: 'none yet',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false, note: 'one-to-watch',
  },
  {
    name: 'text-splitter', url: 'https://github.com/benbrandt/text-splitter', category: 'data/RAG', quadrant: 'data',
    ring: 'Trial', maintenance: 'actively maintained (benbrandt)', latest: 'v0.30.x',
    adopters: 'widely used across Rust RAG stacks; semantic-text-splitter on PyPI',
    mentions: 'Rust & AI Weekly #2 (2026-06-22)', returning: false,
    note: 'semantic chunking by token/char budget; callable from Rust and Python',
  },

  // ── Dev Tools & Editors ──
  {
    name: 'Zed', url: 'https://github.com/zed-industries/zed', category: 'dev-tools/editor', quadrant: 'dev',
    ring: 'Adopt', maintenance: 'actively maintained (Zed Industries)', latest: 'stable Jun 2026; v1.0 in 2026',
    stars: '~83k★', adopters: 'VC-backed; native agentic editing',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'aichat', url: 'https://github.com/sigoden/aichat', category: 'dev-tools/cli', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained', latest: 'v0.28.0 (Feb 2026)',
    stars: '~10k★', adopters: '20+ LLM providers',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false,
  },
  {
    name: 'Tabby', url: 'https://github.com/TabbyML/tabby', category: 'dev-tools/coding-assistant', quadrant: 'dev',
    ring: 'Hold', maintenance: 'maintained, but release cadence slowed', latest: 'v0.30 (Jul 2025) — ~11mo gap; commits continue',
    stars: '~24k★', adopters: 'self-hosted Copilot alternative',
    mentions: 'Rust & AI Weekly #1 (2026-06-19)', returning: false, note: 'watch-cadence',
  },
  {
    name: 'Diplomat', url: 'https://github.com/rust-diplomat/diplomat', category: 'dev-tools/FFI', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (rust-diplomat; ICU4X lineage)', latest: 'active 2026 (Java/Panama backend WIP)',
    adopters: "ICU4X's cross-language bindings",
    mentions: 'Rust & AI Weekly #2 (2026-06-22)', returning: false,
    note: 'idiomatic C/C++/JS bindings from tagged "bridge" Rust; compare against UniFFI',
  },
  {
    name: 'Iroh', url: 'https://www.iroh.computer/blog/v1', category: 'dev-tools/networking', quadrant: 'dev',
    ring: 'Trial', maintenance: 'very actively maintained (n0 / N0 Inc.)', latest: 'v1.0 (Jun 2026)',
    adopters: '200M+ endpoints created in last 30 days; Python/Node/Swift/Kotlin bindings',
    mentions: 'Rust & AI Weekly #2 (2026-06-22); Rust & AI Weekly #3 (2026-07-08)', returning: true,
    note: 'dial devices by public key over QUIC; committed wire-protocol stability; P2P substrate for distributed/multi-agent systems; GuardianDB 0.17 now ships on it',
  },
  {
    name: 'agent-client-protocol', url: 'https://github.com/agentclientprotocol/agent-client-protocol', category: 'agentic/protocol', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively maintained (Zed Industries + ACP org)', latest: 'v1.2.0 (Jul 2026)',
    adopters: 'registry live: Claude Code, Codex CLI, Copilot CLI, Gemini CLI, OpenCode',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'the LSP move replayed for agents; JSON-RPC seam keeps exit cost modest; spec young and Zed-steered',
  },
  {
    name: 'Slint', url: 'https://github.com/slint-ui/slint', category: 'dev-tools/gui', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (SixtyFPS GmbH; NLnet-funded features)', latest: '1.17 (Jun 2026)',
    adopters: 'LibrePCB; broad embedded base',
    mentions: 'Rust & AI Weekly #3 (2026-07-08); Crate Radar Deep Dive (2026-07-08)', returning: false,
    note: 'desktop-ready push (DnD, tray, tooltips) + embedded MCP server so agents can drive a running UI; tri-license needs a legal read',
  },
  {
    name: 'curve25519-dalek', url: 'https://github.com/dalek-cryptography/curve25519-dalek', category: 'dev-tools/crypto', quadrant: 'dev',
    ring: 'Adopt', maintenance: 'actively maintained (dalek-cryptography org)', latest: 'v5.0.0 (Jul 2026)',
    adopters: 'foundational; huge transitive dep tree',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'coordinated dalek-family major; breaking BasepointTable trait, so schedule one family upgrade PR and don’t let pins drift',
  },
  {
    name: 'image-png', url: 'https://github.com/image-rs/image-png', category: 'data/media', quadrant: 'data',
    ring: 'Adopt', maintenance: 'actively maintained (image-rs)', latest: 'ongoing perf work (Jun 2026)',
    adopters: 'Chromium default since M139; GNOME 49 via glycin',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'memory safety with a performance receipt: fastest PNG decoder, already in the browsers',
  },
  {
    name: 'kache', url: 'https://github.com/kunobi-ninja/kache', category: 'dev-tools/build-cache', quadrant: 'dev',
    ring: 'Trial', maintenance: 'very actively maintained (Kunobi; seven minor releases since June)', latest: 'v0.14.0 (Aug 12, 2026)',
    adopters: 'young vs. entrenched sccache',
    mentions: 'Radar Digest (2026-06-15); Rust & AI Weekly #3 (2026-07-08); Rust & AI Weekly #5 (2026-07-20); Rust & AI Weekly #6 (2026-08-03); Rust & AI Weekly #7 (2026-08-11); Rust & AI Weekly #8 (2026-08-17)', returning: true,
    note: 'verdict holds at Trial: 0.14 adds debuggable restores and cross-clone convergence, so a cache miss is now explainable rather than mysterious; seventh minor since June, near-zero exit cost',
  },
  {
    name: 'Test That!', url: 'https://hovinen.me/announcements/2026/06/24/introducing-test-that.html', category: 'dev-tools/testing', quadrant: 'dev',
    ring: 'Assess', maintenance: 'brand new, solo (original googletest-rust author)', latest: 'pre-1.0 (Jun 2026)',
    adopters: 'none yet; googletest alias features ease migration',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'googletest-rust forked by its own creator over the 0.12 matcher redesign; watch for contributors before betting',
  },
  {
    name: 'hotpath', url: 'https://hotpath.rs', category: 'dev-tools/profiling', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively developed, young', latest: '0.18 (Jun 2026)',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'async profiling that understands channel + lock contention; treat output as a lead, not gospel',
  },
  {
    name: 'cargo-rdme', url: 'https://github.com/orium/cargo-rdme', category: 'dev-tools/cargo', quadrant: 'dev',
    ring: 'Adopt', maintenance: 'maintained', latest: 'TWiR 657 Crate of the Week',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'README generated from crate docs; CI step, adoption risk ~zero',
  },
  {
    name: 'AimDB', url: 'https://github.com/aimdb-dev/aimdb', category: 'data/edge', quadrant: 'data',
    ring: 'Assess', maintenance: 'actively developed, small team, pre-1.0', latest: 'BYO-connector transport layer (Jun 2026)',
    mentions: 'Rust & AI Weekly #3 (2026-07-08)', returning: false,
    note: 'typed record hub for MCU-to-cloud dataflows; swap transports via 3 traits (~40 lines); std + no_std/Embassy',
  },
  {
    name: 'copper-rs', url: 'https://github.com/copper-project/copper-rs', category: 'agentic/robotics', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively maintained (Copper Project / Copper Robotics; Guillaume Binet)', latest: 'v1.0.0 (Jul 3, 2026)',
    mentions: 'Rust & AI Weekly #4 (2026-07-13)', returning: false,
    note: 'deterministic robotics runtime ("game engine for robots") hits 1.0 after 1043 PRs; semver promise, keyframes, cu_memmon heap monitor, ROS2 bridge; the Rust substrate for physical AI',
  },
  {
    name: 'rama', url: 'https://github.com/plabayo/rama', category: 'networking/framework', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (Plabayo full-time; Glen De Cauwsemaecker + Brecht Stamper)', latest: 'v0.4.0 (Aug 21, 2026; six weeks after 0.3)',
    adopters: 'commercial partners in data extraction, security, AI (LLM harness, AI proxy gateways), cloud infra',
    mentions: 'Rust & AI Weekly #4 (2026-07-13); Rust & AI Weekly #9 (2026-08-24)', returning: true,
    note: 'UPGRADE Assess to Trial: in #4 the open question was whether the promised 2-8 week release train would hold, and 0.4 landed at six weeks. 0.4 adds system-proxy and PAC support, running PAC JavaScript inside a wasmtime sandbox so a crashing JS engine cannot take the process down, plus ttRPC, proto-free gRPC codegen macros, and streamed HAR export. Still breaking changes between minors, so pin and read the changelog',
  },
  {
    name: 'Sōzu', url: 'https://github.com/sozu-proxy/sozu', category: 'networking/load-balancer', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (Clever Cloud)', latest: 'v2.1.0 (Jul 2026)',
    adopters: 'Clever Cloud production edge',
    mentions: 'Rust & AI Weekly #4 (2026-07-13)', returning: false,
    note: 'hot-reconfigurable reverse proxy adds UDP load balancing for the programmable edge; corporate steward with production skin in the game',
  },
  {
    name: 'apalis', url: 'https://github.com/geofmureithi/apalis', category: 'infra/background-jobs', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (geofmureithi)', latest: 'v1.0.0-rc (2026; apalis-postgres updated May 2026)',
    mentions: 'Rust & AI Weekly #4 (2026-07-13)', returning: false,
    note: 'the Rust seat at the Postgres-job-queue table Go-land calls River; tower-style middleware, Postgres NOTIFY low-latency fetch, nearing 1.0',
  },
  {
    name: 'GuardianDB', url: 'https://www.willsearch.com.br/blog/2026/07/04/meet-guardiandbs-new-postgresql-compatibility-layer/', category: 'data/p2p', quadrant: 'data',
    ring: 'Assess', maintenance: 'actively developed', latest: 'Guardian Sentinel TUI (Jul 2026)',
    mentions: 'Rust & AI Weekly #2 (2026-06-22); Rust & AI Weekly #3 (2026-07-08); Rust & AI Weekly #4 (2026-07-13); Rust & AI Weekly #5 (2026-07-20)', returning: true,
    note: 'P2P/local-first database on Iroh; after the PostgreSQL wire layer it now ships Guardian Sentinel, a terminal UI for operating nodes; fourth mention, verdict holds at Assess',
  },
  {
    name: 'bullmq-official', url: 'https://bullmq.io/news/260712/rust-release/', category: 'infra/background-jobs', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (Taskforce.sh Inc., SOC 2 certified; Manuel Astudillo)', latest: 'v1.1.0 (Jul 15, 2026; three releases in first week)',
    adopters: 'interop with Node/Python/PHP/Elixir BullMQ deployments out of the box',
    mentions: 'Rust & AI Weekly #5 (2026-07-20)', returning: false,
    note: 'official Rust BullMQ runs the exact same battle-tested Lua scripts as the Node reference; benchmarks match or beat Node from day one; the Redis seat next to apalis at the Postgres table',
  },
  {
    name: 'Grok Build', url: 'https://github.com/xai-org/grok-build', category: 'agentic/coding-agent', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'maintained by xAI; repo synced from monorepo, no external contributions', latest: 'open-sourced Jul 15, 2026 (Apache 2.0)',
    adopters: 'xAI grok CLI users; community fork (gork-build) strips vendor telemetry',
    mentions: 'Rust & AI Weekly #5 (2026-07-20)', returning: false,
    note: '~845k lines of production Rust coding-agent harness + TUI, ACP support; open source but closed governance, so read it more than you fork it',
  },
  {
    name: 'Topcoat', url: 'https://github.com/tokio-rs/topcoat', category: 'dev-tools/web-framework', quadrant: 'dev',
    ring: 'Assess', maintenance: 'actively developed (tokio-rs org)', latest: 'announced Jul 2026, early-stage',
    adopters: 'none yet; Tokio stewardship from day one',
    mentions: 'Rust & AI Weekly #5 (2026-07-20)', returning: false,
    note: 'batteries-included full-stack: async server components query the DB directly, $() expressions type-check as Rust and transpile to JS, no wasm bundle; the strongest steward a week-old framework could ask for',
  },
  {
    name: 'cochlea', url: 'https://github.com/richer-richard/cochlea', category: 'agentic/audio', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'very active, solo maintainer (0.1 to 0.3 in three weeks)', latest: 'v0.3.0 (Jul 22, 2026)',
    adopters: 'none yet; cochlea probe works on any WAV/FLAC as the adoption wedge',
    mentions: 'Rust & AI Weekly #5 (2026-07-20); Rust & AI Weekly #6 (2026-08-03)', returning: true,
    note: 'headless deterministic audio engine for AI agents; 0.3.0 adds melody read-back, MFCC timbre features, a master limiter, and MIDI import; verdict holds at Assess',
  },
  {
    name: 'Turso Database', url: 'https://github.com/tursodatabase/turso', category: 'data/database', quadrant: 'data',
    ring: 'Assess', maintenance: 'very actively maintained (Turso; 260+ contributors; DST + fuzzing + formal methods)', latest: 'SQLite rewrite out of beta; Postgres-in-Rust announced (Jul 2026)',
    adopters: 'Turso Cloud',
    mentions: 'Rust & AI Weekly #5 (2026-07-20)', returning: false,
    note: 'positioning as the LLVM of databases: one Rust core, pluggable SQL frontends compiled to VDBE bytecode; SQLite frontend is real today, the Postgres one is an ambition with a pgmicro proof of concept',
  },
  {
    name: 'syn', url: 'https://github.com/dtolnay/syn', category: 'dev-tools/proc-macros', quadrant: 'dev',
    ring: 'Adopt', maintenance: 'actively maintained (David Tolnay; 2.x line still receiving parallel releases)', latest: 'v3.0.3 (Jul 2026; 3.0.0 landed Jul 18)',
    adopters: 'underneath serde_derive, thiserror, async-trait, and most derive macros in the ecosystem',
    mentions: 'Rust & AI Weekly #6 (2026-08-03)', returning: false,
    note: 'first major in three years; ten new non-exhaustive *Modifiers structs reserve room for in-flight language RFCs so future syntax lands without another major; budget the migration, and watch for duplicate syn majors bloating your dependency tree',
  },
  {
    name: 'SeaORM', url: 'https://github.com/SeaQL/sea-orm', category: 'data/orm', quadrant: 'data',
    ring: 'Trial', maintenance: 'actively maintained (SeaQL, Chris Tsang; 278 contributors)', latest: 'v2.0.0 (Jul 20, 2026; after 43 release candidates)',
    stars: '~9.8k', downloads: '~22M', adopters: 'wide production use; Seaography GraphQL layer on top',
    mentions: 'Rust & AI Weekly #6 (2026-08-03)', returning: false,
    note: 'largest release in project history: dense entity format, entity-first schema sync, nested ActiveModel, typed COLUMN constants, sync API, Arrow/Parquet; the 1.0 API still works, so migration is incremental',
  },
  {
    name: 'crimson-crab', url: 'https://github.com/singhpratech/crimson-crab', category: 'agentic/client', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'brand new, solo maintainer (singhpratech), fast cadence', latest: 'v0.2.x (Jul 2026; typed schemars schemas landed in 0.2.0)',
    adopters: 'none named; ships an rmcp-based MCP server template',
    mentions: 'Rust & AI Weekly #6 (2026-08-03)', returning: false,
    note: 'Claude-only Rust SDK: panic-free by compile-time lint gate, forward-compatible wire enums, tokio-free public API, wasm32 support; deliberately deep where rig and genai are broad',
  },
  {
    name: 'flodl', url: 'https://flodl.dev', category: 'inference/training', quadrant: 'inference',
    ring: 'Assess', maintenance: 'actively developed, solo (self-described human direction, AI implementation)', latest: 'AMD GPU support announced (Aug 2026; 0.7.0 line)',
    adopters: 'none named',
    mentions: 'Rust & AI Weekly #6 (2026-08-03); Rust & AI Weekly #8 (2026-08-17)', returning: true,
    note: 'verdict holds at Assess: distributed training across mismatched GPUs (DDP, DiLoCo), and AMD support turns the heterogeneity thesis from mixed-NVIDIA into genuinely mixed-vendor; still solo, still pre-1.0, and the measurement honesty remains the reason to read it',
  },
  {
    name: 'webrtc', url: 'https://github.com/webrtc-rs/webrtc', category: 'networking/webrtc', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (webrtc-rs org; Sans-I/O rtc core underneath)', latest: 'v0.20.2 (Aug 11, 2026; 0.20.0 landed Jul 31)',
    adopters: 'appr.tc built on it; v0.17.x line now bug-fix-only',
    mentions: 'Rust & AI Weekly #7 (2026-08-11)', returning: false,
    note: 'first stable of the Sans-I/O, runtime-agnostic rewrite: one handler trait replaces callback hell, pluggable Runtime trait (Tokio/smol/bring-your-own per connection), data channels beat Pion on aggregate throughput and per-byte CPU; vindicates str0m’s sans-I/O design; migration from 0.17.x is a real port, so schedule it',
  },
  {
    name: 'FalkorDB (Rust engine)', url: 'https://github.com/FalkorDB/falkordb-rs-next-gen', category: 'data/graph', quadrant: 'data',
    ring: 'Assess', maintenance: 'actively developed (FalkorDB; Dvir Dukhan and Avi Avni; humans reviewed every change, agents did bounded work)', latest: 'preview engine at C-parity (post Aug 3, 2026)',
    adopters: 'FalkorDB users (GraphRAG/knowledge graphs); Rust engine is a preview, not the default',
    mentions: 'Rust & AI Weekly #7 (2026-08-11)', returning: false,
    note: '80k lines of Rust, 357 PRs, validated against 1,585 TCK scenarios and 1,322 flow tests before perf work was allowed to matter; GraphBLAS sparse-matrix graph DB for GraphRAG',
  },
  {
    name: 'amtr', url: 'https://github.com/arian-shamaei/anthropometer', category: 'dev-tools/observability', quadrant: 'dev',
    ring: 'Assess', maintenance: 'brand new, solo maintainer (Arian Shamaei)', latest: 'v0.1.5 (Jul 30, 2026)',
    adopters: 'none yet',
    mentions: 'Rust & AI Weekly #7 (2026-08-11)', returning: false,
    note: 'btop-style live monitor for what is actually in a Claude Code session context window: context map, cache economics, subagents; ships a forensic autopsy of its own vibe-coded construction (152h41m, 1,235 turns, ~$1,046, ~98% cache hit rate)',
  },
  {
    name: 'okf-rs', url: 'https://github.com/jyjeanne/okf-rs', category: 'agentic/code-knowledge', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'one human maintainer (Jeremy JEANNE) directing coding agents; zero external contributors; MIT/Apache-2.0', latest: 'v0.4.0 (Aug 7, 2026; four releases in ten days, then quiet)',
    adopters: 'none; no independent technical reception; 71★',
    mentions: 'Rust & AI Weekly #7 (2026-08-11)', returning: false,
    note: 'tree-sitter codebase to deterministic, git-diffable Markdown call-graph bundle (Open Knowledge Format) served over MCP; the Markdown-as-artifact bet is a real distinction from the SQLite/vector-index norm, but this is not a new category (CodeGraph 66k★, tokensave is its Rust port, OKF is Google’s format) and he ships his own gap analysis saying so; headline ~400x is a self-labelled rule-of-thumb, while the measured win is collapsing 13 graph_* tools into one graph(relation=) after finding schema registration can cost more than it saves; not on crates.io and both workspace names are taken there',
  },
  {
    name: 'BitFun', url: 'https://github.com/GCWing/BitFun', category: 'agentic/desktop', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'actively developed (GCWing)', latest: 'v0.2.17 (Aug 2026)',
    adopters: 'none named',
    mentions: 'Rust & AI Weekly #7 (2026-08-11)', returning: false,
    note: 'desktop agent suite on a Rust runtime with a Tauri shell: Code Agent, Cowork Agent, Computer Use; resident cross-turn index claims ~36x average search speedup on Chromium-scale trees, and 98.67% cache hit on SWE-Bench-Pro; all figures self-reported',
  },
  {
    name: 'fearless_simd', url: 'https://github.com/linebender/fearless_simd', category: 'inference/simd', quadrant: 'inference',
    ring: 'Trial', maintenance: 'actively maintained (Linebender; Shnatsel driving releases)', latest: 'v0.7.0 (Aug 12, 2026; v1.0 targeted for early September)',
    adopters: 'a dozen-plus direct dependents on crates.io; 1000+ repos directly or transitively',
    mentions: 'Rust & AI Weekly #8 (2026-08-17)', returning: false,
    note: 'takes unsafe out of SIMD: the compiler tracks which intrinsics belong to which instruction set, so the crate itself carries orders of magnitude less unsafe than the alternatives; 0.7 completes type coverage with 64-bit integers, adds an explicit SSE2 level, and makes every operation reachable through traits; zero dependencies and a 2-second cold build; API frozen ahead of 1.0, so speak now',
  },
  {
    name: 'OXVG', url: 'https://github.com/noahbald/oxvg', category: 'dev-tools/svg', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (Noah Bald; Devon Govett of Parcel contributing)', latest: 'v0.0.7 (Aug 9, 2026)',
    stars: '~604★', adopters: 'Parcel uses it as its default SVG optimisation path',
    mentions: 'Rust & AI Weekly #8 (2026-08-17)', returning: false,
    note: 'Rust SVG toolchain positioned as a drop-in SVGO replacement (with an svgo-config converter), now growing an SVGR-compatible JSX transformer in 0.0.7; usable from CLI, Node NAPI, wasm, or Rust; Trial for the optimiser Parcel already ships, Assess for the week-old JSX path',
  },
  {
    name: 'grit-datatype', url: 'https://singhpratech.github.io/grit-datatype/', category: 'inference/quantization', quadrant: 'inference',
    ring: 'Assess', maintenance: 'new, solo maintainer (singhpratech, also crimson-crab/ferrovec)', latest: 'GRIT 1.1 (Aug 2026)',
    adopters: 'none named',
    mentions: 'Rust & AI Weekly #8 (2026-08-17)', returning: false,
    note: 'zero-dependency descriptor type for quantized tensors (MXFP4/GPTQ/AWQ-style): a 64-byte POD header plus an O(1) bounds check, so a mismatched scale plane or zero-point convention fails loudly instead of producing plausible garbage; author self-suggested it for Crate of the Week, and adoption depends on runtimes agreeing to carry the descriptor',
  },
  {
    name: 'vairedb', url: 'https://github.com/matteobovetti/vairedb', category: 'data/analytics', quadrant: 'data',
    ring: 'Assess', maintenance: 'brand new, solo (Matteo Bovetti)', latest: 'v0.1.0 (Aug 2026)',
    adopters: 'none',
    mentions: 'Rust & AI Weekly #8 (2026-08-17)', returning: false,
    note: 'cloud-native distributed analytical database at its first tagged release; noted for the record rather than recommended, and it enters a category where DataFusion and Databend already have years of production mileage',
  },
  {
    name: 'kobe', url: 'https://github.com/kunobi-ninja/kobe', category: 'dev-tools/kubernetes', quadrant: 'dev',
    ring: 'Assess', maintenance: 'very actively maintained (Kunobi; same stable as kache)', latest: 'v0.39.0 (Aug 12, 2026)',
    adopters: 'none named',
    mentions: 'Rust & AI Weekly #7 (2026-08-11); Rust & AI Weekly #8 (2026-08-17)', returning: true,
    note: 'Rust operator that keeps pools of pre-warmed ephemeral Kubernetes clusters and hands them out as TTL-enforced leases; 0.39 hardens the lease lifecycle, which is exactly the part that bites when a lease expires mid-test',
  },
  {
    name: 'syd', url: 'https://gitlab.exherbo.org/sydbox/sydbox', category: 'agentic/sandboxing', quadrant: 'agentic',
    ring: 'Trial', maintenance: 'actively developed, solo but long-running (Ali Polatel; 195 releases; OpenSSF best-practices badge)', latest: 'v3.58.0 (Aug 2026)',
    downloads: '~495k/month', adopters: 'packaged for Alpine, Arch, Exherbo and Gentoo; syd-oci variant runs under Docker/Podman/CRI-O',
    mentions: 'Rust & AI Weekly #9 (2026-08-24)', returning: false,
    note: 'application kernel in Rust: implements a subset of the Linux kernel interface in user space and executes syscalls on behalf of the sandboxed process, so it does not carry the TOCTTOU hole that trapping sandboxes do. Runs as an unprivileged user with no SETUID and no eBPF, over Seccomp-BPF/Notify plus Landlock (ABI up to 7) and optional namespaces. Ioctl sandboxing is documented as the way to contain AI/ML workloads while still allowing PTY, DRM and KVM, which makes it the most direct answer available to "what confines the coding agent I let run shell commands". GPL-3.0, so it is a tool you run, not a library you link; Linux >= 5.19 only',
  },
  {
    name: 'OxiSH', url: 'https://github.com/djc/oxish', category: 'security/ssh', quadrant: 'dev',
    ring: 'Assess', maintenance: 'new public release after 20 months of private work (Dirkjan Ochtman; Trifecta Tech Foundation contributed, funded by the Sovereign Tech Agency)', latest: 'announced Aug 13, 2026',
    adopters: 'none; author is about to start dogfooding on his own server',
    mentions: 'Rust & AI Weekly #9 (2026-08-24)', returning: false,
    note: 'memory-safe SSH server with a sans-I/O protocol core and a pluggable crypto backend (graviola by default, aws-lc-rs for portability and FIPS mode). Deliberately tiny algorithm set: hybrid post-quantum mlkem768x25519-sha256 key exchange, Ed25519 and ecdsa-sha2-nistp256 keys, AES-128-GCM, SHA-256. Author maintains rustls, Quinn and Hickory DNS, reviewed historic OpenSSH CVEs while designing, and says plainly it is not production-ready: no forwarding, no scp/sftp, no password auth, no Windows, no external audit funded yet',
  },
  {
    name: 'tokio_with_wasm', url: 'https://github.com/cunarist/tokio-with-wasm', category: 'dev-tools/wasm', quadrant: 'dev',
    ring: 'Assess', maintenance: 'actively maintained, small team (Dong-Hyun "Danny" Kim / Cunarist; also Rinf)', latest: 'v0.9.0 (2026)',
    downloads: '~1.6M all-time', adopters: 'Rinf (Rust-in-Flutter) is the reference consumer',
    mentions: 'Rust & AI Weekly #9 (2026-08-24)', returning: false,
    note: 'This Week in Rust 665 Crate of the Week, self-suggested: drop-in tokio modules for wasm32 browser targets, where threads, time, file IO and network IO are all restricted. Lets one codebase target native and browser, which is the plumbing you need to run the same Rust agent or inference glue server-side and client-side. It is a compatibility shim over web APIs, not real tokio, so the semantics differ where the browser makes them differ',
  },
  {
    name: 'cargo-pgo', url: 'https://github.com/Kobzol/cargo-pgo', category: 'dev-tools/build', quadrant: 'dev',
    ring: 'Trial', maintenance: 'maintained, solo (Jakub Beránek / Kobzol, who also runs rustc perf triage)', latest: 'v0.2.9',
    adopters: 'used across the Rust performance community; rustc itself is PGO-built',
    mentions: 'Rust & AI Weekly #9 (2026-08-24)', returning: false,
    note: 'rust-alternative-to Go\'s built-in PGO (go build -pgo): a cargo subcommand that wires up instrumentation, profile merging and BOLT so profile-guided optimisation is three commands instead of a research project. Surfaced by pairing Daniel Lemire\'s Go PGO measurements with this week\'s rustc stabilisation of -Zprofile-sample-use. The honest gap is that Go ships PGO in the toolchain and Rust does not: this is a third-party subcommand, BOLT is Linux-only, and the whole thing is worthless without a representative workload to profile',
  },
  {
    name: 'cargo-acl (Cackle)', url: 'https://github.com/cackle-rs/cackle', category: 'security/supply-chain', quadrant: 'dev',
    ring: 'Trial', maintenance: 'maintained but slow-cadence, effectively solo (David Lattimore, who also writes the wild linker); 9 releases, 634 commits', latest: 'v0.9.1 (May 7, 2026)',
    stars: '~274★', adopters: 'none named publicly; ships a GitHub Action (cackle-action)',
    mentions: 'Rust & AI Weekly #10 (2026-08-31)', returning: false,
    note: 'code ACL checker: analyses every crate in the dependency tree for which API categories it actually reaches (net, fs, process, unsafe) and fails the build when a data-processing crate starts touching sockets. With bubblewrap installed it runs build scripts, tests and rustc itself inside a sandbox, and each build script gets its own sandbox config, which is the exact control the arrayref/proc-macro1 attack of 2026-08-20 defeated (a build script that downloaded and ran a remote payload). Linux only. The README is unusually honest that a determined attacker can circumvent detection and that this supplements rather than replaces review. Exit cost is zero (a CI job and a cackle.toml), entry cost is the config pass over your tree',
  },
  {
    name: 'cargo-vet', url: 'https://mozilla.github.io/cargo-vet/', category: 'security/supply-chain', quadrant: 'dev',
    ring: 'Trial', maintenance: 'actively maintained (Mozilla); 9 official audit registries including Mozilla, Google and the Bytecode Alliance', latest: 'in continuous use; ecosystem measured Aug 12, 2026 by Light Squares',
    adopters: '408 public repos incl. Firefox, Chromium, Tauri, Wasmtime; 326 of them import at least one audit feed',
    mentions: 'Rust & AI Weekly #10 (2026-08-31)', returning: false,
    note: 'enforces that every active dependency is audited or explicitly exempted, so it can stop malicious code entering the build rather than reacting to a CVE later. Light Squares measured the real cost in 2026: adoption up 101% this year, but the median project carries 131 exemptions, the median fully-vetted project faces 8.7k changed lines of review per week (50k at p90), the median lag from a crates.io release to its first registry audit is 29 days, and 40% of adopted RustSec fix versions never got audited at all. Trial rather than Adopt precisely because of that burden: the safe-to-run gate in CI before any build step is the high-value slice, and full vetting is an FTE conversation',
  },
  {
    name: 'swift-topomap', url: 'https://github.com/swiftlogicsystems/swifttopology', category: 'dev-tools/observability', quadrant: 'dev',
    ring: 'Assess', maintenance: 'brand new, single vendor (SwiftLogic Systems; Ankur Rathore self-suggested it); 44 commits, first open-source release', latest: 'v0.2.3-beta (Aug 2026)',
    stars: '0★ at time of writing', adopters: 'none; validated by the vendor on Intel Xeon bare metal',
    mentions: 'Rust & AI Weekly #10 (2026-08-31)', returning: false,
    note: 'This Week in Rust 666 Crate of the Week: a ratatui TUI that maps NUMA nodes, L3 cache boundaries and cores from a native sysfs parser (no libhwloc) and overlays live IPC and cache-miss counters via eBPF CO-RE, so you can tell a core that is computing from a core that is stalled on memory. Relevant to anyone whose inference server or tokenizer reads as 100% CPU without getting faster. Caveats: Linux and eBPF only, beta, zero external adopters, the documented install is curl-to-sudo of a release binary, and the credits state the architecture and kernel eBPF C were developed via AI pair programming with Gemini, which is a disclosure worth having and also a reason to read the kernel-adjacent code before running it as root',
  },
  {
    // Display name abbreviated for the radar legend; published crate name is r3bl-rust-analyzer-mcp-server.
    name: 'r3bl-ra-mcp-server', url: 'https://crates.io/crates/r3bl-rust-analyzer-mcp-server', category: 'agentic/mcp', quadrant: 'agentic',
    ring: 'Assess', maintenance: 'actively maintained inside r3bl-open-core (Nazmul Idris)', latest: 'published on crates.io; design write-up dated Aug 22, 2026',
    adopters: 'the author, driving Antigravity, Claude Code and Cursor against rust-analyzer',
    mentions: 'Rust & AI Weekly #10 (2026-08-31)', returning: false,
    note: 'MCP server that bridges coding agents to a rust-analyzer LSP subprocess, so an agent asks the type system where a symbol is used instead of grepping. Notable less for the bridge than for the argument attached to it: Idris deliberately left Tokio out in favour of a synchronous three-thread pipeline over stdio, on the grounds that a 1:1 local pipe gets no benefit from a work-stealing multi-threaded runtime and pays for it in accidental complexity. Assess: useful today, single maintainer, and the interesting artefact is the reasoning rather than the code',
  },
  {
    name: 'comrak', url: 'https://github.com/kivikakk/comrak', category: 'data/markdown', quadrant: 'data',
    ring: 'Adopt', maintenance: 'actively maintained and partly funded (Asherah Connor / kivikakk; in scope of her paid work since Sep 2025)', latest: 'v0.54.x line (exact release date unverified this run)',
    stars: '~1.7k★', adopters: 'wide; backs commonmarker (Ruby), MDEx (Elixir) and Python bindings, 148 crates depend on it',
    mentions: 'Rust & AI Weekly #10 (2026-08-31)', returning: false,
    note: 'rust-alternative-to Goldmark 2.0 (Go), whose headline feature this week was position info on every AST node. Comrak is the Rust CommonMark/GFM parser that already reports sourcepos, builds a real mutable AST, and passes 652/652 CommonMark and 670/670 GFM tests. The AI-adjacent reason to care: RAG chunking that carries byte offsets lets you cite the exact source span rather than a whole document. It models cmark-gfm closely, which makes it predictable and slower than pulldown-cmark (the no-AST parser rustdoc uses); pick comrak when you need to walk or rewrite the tree, pulldown-cmark when you need throughput',
  },
]

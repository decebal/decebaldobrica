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

export const RADAR_GENERATED_AT = '2026-07-08'

/** Issue number shown in the generated radar image subtitle. Bump per issue. */
export const RADAR_ISSUE = 3

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
    ring: 'Trial', maintenance: 'very actively maintained (Kunobi; 0.8→0.9 inside two weeks)', latest: 'v0.9.0 (Jul 2026)',
    adopters: 'young vs. entrenched sccache',
    mentions: 'Radar Digest (2026-06-15); Rust & AI Weekly #3 (2026-07-08)', returning: true,
    note: 'verdict upgraded Assess→Trial: correctness work landed (content-hashed static libs, self-healing index, ReFS zero-copy restores); near-zero exit cost',
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
]

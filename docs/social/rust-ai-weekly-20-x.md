# Issue 20 connected X thread

Status: unpublished. Post only after edition-specific approval and canonical article availability. Root carries matching artwork and alt text; posts 2–6 reply in sequence. ASCII copy; URL weighted as 23 characters.

## 1

Systemd accepted Rust for new leaf programs, keeping shared core code in C. Support merged October 24; the November 3 explanation sets out the limits.

Rust & AI Weekly #20 covers that decision and three tool evaluations. A thread. 1/6

## 2

For a similar integration, I would start with one component: its calls, allocation ownership and failure behaviour. Compare both implementations on the same inputs, then build in the target environment.

Rust remains optional in systemd. 2/6

## 3

Rustup 1.29.3 shipped November 3. It fixes illegal instruction errors on some x86_64 CPUs without SSE4.1 and a lock error on Solaris.

Adopt for toolchain management. Test the affected host class; preserve the project's compiler pin. 3/6

## 4

Tellus 0.5.3: Assess. Its persistence contract says a crash after event append can lose the outward continuation; replay does not rerun it.

I would interrupt a harmless notification between append and delivery, restart, then inspect the receiver's records. 4/6

## 5

Sysinfo 0.40.1: Trial for telemetry. Review removed APIs, OsString interface names and Windows load-average handling alongside GPU collection.

Use the refresh workload your collector needs. No author benchmark was independently reproduced here. 5/6

## 6

Issue #20 has version dates, licence checks, separate maintenance/adoption signals and proposed acceptance checks. Radar: 98 tools.

The systemd merge and earlier crate releases are dated explicitly.

https://decebaldobrica.com/blog/2026-11-09-rust-ai-weekly-20

6/6

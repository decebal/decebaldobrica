import ServicePage from '@/components/ServicePage'
import type { Metadata } from 'next'
import Link from 'next/link'

const title = 'Rust Consulting & Architecture Review'
const description =
  'Hire a Rust consultant for code reviews, async architecture and event-sourced services. Work directly with Decebal Dobrica on a scoped engineering outcome.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services/rust-consulting' },
  openGraph: { title, description, url: '/services/rust-consulting' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function RustConsultingPage() {
  return (
    <ServicePage
      title="Rust consulting and software architecture review"
      intro="Wolven Tech is Decebal Dobrica's one-person Rust advisory practice. Bring a difficult service, an architecture decision or a codebase that needs an independent review. The engagement starts with an explicit engineering outcome and the evidence needed to verify it."
      relatedHref="/services/software-technical-due-diligence"
      relatedLabel="Software technical due diligence"
    >
      <section>
        <h2>Hire a Rust consultant for a defined problem</h2>
        <p>
          A team may need help diagnosing an async service, separating domain logic from transport,
          or making a recovery path testable. Those are different engagements. Start by describing
          what fails, what the system must preserve and which decisions are still open. A request
          for more Rust code alone does not establish whether implementation is the right next step.
        </p>
        <p>
          Work stays with one named engineer. Wolven Tech does not supply a pool of developers or
          recruit a permanent team. The fit is direct technical work with a founder or engineering
          lead who can provide access, make scope decisions and own the system after handoff.
        </p>
      </section>
      <section>
        <h2>What a Rust architecture review examines</h2>
        <ul>
          <li>
            <strong>Boundaries:</strong> trace one user operation through transport, application
            logic and persistence. Identify which layer owns validation and failure handling.
          </li>
          <li>
            <strong>Async behaviour:</strong> inspect task ownership, cancellation, blocking work,
            bounded queues and backpressure. A timeout is useful only if it stops and reaps the work
            it owns.
          </li>
          <li>
            <strong>State and recovery:</strong> check acknowledgement rules, migrations, event
            compatibility and the procedure used to restore service after interruption.
          </li>
          <li>
            <strong>Verification:</strong> identify which tests execute, which checks run before
            release and whether the deployed artifact can be traced to its source.
          </li>
          <li>
            <strong>Performance evidence:</strong> separate a reproducible workload from a
            microbenchmark. Record configuration and failure conditions before recommending a
            rewrite.
          </li>
        </ul>
        <p>
          Review findings distinguish observed behaviour from risks that still need a test. An
          architecture diagram alone does not prove that production follows its boundaries. Access
          limitations remain visible in the report rather than becoming assumed passes.
        </p>
      </section>
      <section>
        <h2>Choose review, embedded support or a bounded build</h2>
        <p>
          A review fits a decision: whether a service can support a new workload, which recovery gap
          to address first, or how to divide a growing workspace. Its output is a written assessment
          with evidence, risks and verification steps. Implementation is a separate scope unless
          explicitly included in the proposal.
        </p>
        <p>
          Fractional Rust architecture support fits a team that needs recurring code review, design
          discussion and hands-on changes. Agree who approves decisions and which work the
          engagement owns. The existing team keeps operational ownership; an adviser should not
          become an undocumented dependency in the release process.
        </p>
        <p>
          A platform build fits one concrete deliverable: an event-sourced service, MCP server, WASM
          module or Tauri application. Define acceptance through a working flow, then include
          source, setup instructions and a runbook in the handoff. Staffing an open-ended programme
          is outside this model.
        </p>
      </section>
      <section>
        <h2>A useful brief before repository access</h2>
        <p>
          Send the system's purpose, your role, the decision or failure to investigate and the
          constraints that cannot change. Include the Rust stack and deployment shape if known.
          Describe whether a failing behaviour is reproducible; do not send production credentials,
          customer records or proprietary source through the contact form.
        </p>
        <p>
          For a performance issue, a non-sensitive description of request size, concurrency and
          latency distribution helps shape the next measurement. For event sourcing, describe stream
          boundaries and what must survive a restart. For architecture, name the change the current
          structure makes difficult. Unknowns are useful inputs when labelled clearly.
        </p>
      </section>
      <section>
        <h2>Public work you can inspect</h2>
        <p>
          <a href="https://www.all-source.xyz/platform/event-sourcing">AllSource</a> is Wolven
          Tech's event store product. Its{' '}
          <a href="https://www.all-source.xyz/event-sourcing/patterns">event-sourcing guides</a>{' '}
          show the storage and recovery questions behind this work. The{' '}
          <Link href="/#artifacts">open-source section</Link> links to Rust tools and templates;
          inspect their scope and current code before treating them as a fit for your own system.
        </p>
        <p>
          The <Link href="/#engagements">engagement summaries</Link> describe anonymised client work
          alongside AllSource. They are examples of technical scope, not promises of equivalent
          performance or cost savings for a new workload. A specific proposal names its own
          deliverables, exclusions, commercial terms and acceptance evidence.
        </p>
      </section>
      <section>
        <h2>When another service is a better fit</h2>
        <p>
          If the decision is an investment or acquisition, use the{' '}
          <Link href="/services/software-technical-due-diligence">
            software technical due diligence review
          </Link>{' '}
          to focus evidence on technical risk and handover. If you need a recruitment agency, a
          penetration-test certification or a full-time operations team, those need a different
          provider. A clear boundary makes the engineering engagement easier to verify.
        </p>
      </section>
    </ServicePage>
  )
}

import ServicePage from '@/components/ServicePage'
import type { Metadata } from 'next'
import Link from 'next/link'

const title = 'Software Technical Due Diligence'
const description =
  'Review a Rust or event-sourced codebase before investment, acquisition or handover. See the evidence checklist, report structure and limits of the assessment.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services/software-technical-due-diligence' },
  openGraph: { title, description, url: '/services/software-technical-due-diligence' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function SoftwareDueDiligencePage() {
  return (
    <ServicePage
      title="Software technical due diligence for Rust codebases"
      intro="A codebase review for investors, acquirers and founders evaluating a Rust-heavy or event-sourced system. Decebal Dobrica reviews the available technical evidence and produces a written assessment of risks, operating dependencies and questions that remain unanswered."
      relatedHref="/services/rust-consulting"
      relatedLabel="Rust consulting and architecture review"
    >
      <section>
        <h2>Start with the decision the report must support</h2>
        <p>
          An investment review, acquisition handover and internal architecture assessment need
          different evidence. Establish the decision before choosing a checklist. A repository can
          demonstrate code structure, but it cannot establish production reliability without
          operational evidence. An interview can explain intent, but does not prove that a restore
          procedure has been exercised.
        </p>
        <p>
          This service covers software engineering risk within an agreed scope. It does not provide
          company valuation, legal advice, financial due diligence or property inspection. It is
          also not a penetration test, compliance certification or guarantee that a system has no
          vulnerabilities. Those specialist assessments need their own qualified providers.
        </p>
      </section>
      <section>
        <h2>Software technical due diligence checklist</h2>
        <ul>
          <li>
            <strong>Build and release:</strong> identify the reviewed commit, reproduce the
            documented setup and trace a deployed version back to source. Record missing access.
          </li>
          <li>
            <strong>Architecture:</strong> map service and crate boundaries, external dependencies
            and the path through one consequential business operation.
          </li>
          <li>
            <strong>Rust workspace health:</strong> inspect feature flags, dependency policy, unsafe
            boundaries, lint enforcement and the difference between compiled and executed tests.
          </li>
          <li>
            <strong>Async operation:</strong> examine blocking calls, cancellation, queue limits and
            task ownership. Ask what happens when a downstream dependency stops responding.
          </li>
          <li>
            <strong>Data integrity:</strong> establish write acknowledgement, concurrency control,
            migration and recovery behaviour. For event sourcing, inspect replay and schema
            compatibility.
          </li>
          <li>
            <strong>Operational readiness:</strong> review available alerts, incident evidence,
            backup restoration and runbooks. Identify tasks only one person knows how to perform.
          </li>
          <li>
            <strong>Security hygiene:</strong> inspect available evidence for access boundaries,
            secret handling and dependency checks without presenting the review as a security
            certification.
          </li>
        </ul>
      </section>
      <section>
        <h2>What the technical due diligence report contains</h2>
        <p>
          The report opens with scope: repositories, revisions, environments, evidence supplied and
          exclusions. Findings separate an observed failure from an inferred risk and an unverified
          claim. Each finding links to the evidence that supports it and explains the consequence
          for the decision being made.
        </p>
        <p>
          A risk register identifies what needs attention, why it matters and how a follow-up check
          would establish resolution. The report also records operating dependencies and handover
          questions. Recommendations are tied to acceptance evidence, so a future reviewer can
          determine whether the proposed work solved the problem.
        </p>
      </section>
      <section>
        <h2>Illustrative finding: recovery evidence is missing</h2>
        <p>
          This is an example of report structure, not a finding about a client. Suppose a runbook
          describes backup restoration but the review receives no restoration result. The observed
          fact is that the supplied evidence does not demonstrate recovery. It would be inaccurate
          to conclude that backups are broken, or to mark recovery as verified.
        </p>
        <p>
          The consequence is uncertainty about recovering the service after data loss. A bounded
          verification step is to restore an agreed backup into an isolated environment, compare
          expected records and run the critical product flow. The result should identify the backup,
          application revision, configuration and remaining exceptions. That evidence can resolve
          the question without turning an assumption into a verdict.
        </p>
      </section>
      <section>
        <h2>Evidence to prepare</h2>
        <p>
          Start with a non-confidential system overview and the decision you need to make.
          Repository access, architecture notes, CI results, release information and operational
          documents can then be agreed under the engagement's confidentiality and access terms.
          Supply redacted examples where customer information is unnecessary.
        </p>
        <p>
          Access should be limited to the review's needs. Do not send credentials or production data
          through the enquiry form. If production access cannot be granted, say so early: a scoped
          code review can still be useful, provided its report does not claim to verify production
          behaviour. Any test that changes a system requires separate agreement.
        </p>
      </section>
      <section>
        <h2>Why Rust and event-sourced systems?</h2>
        <p>
          Wolven Tech's <Link href="/#engagements">published engagement summaries</Link> cover Rust
          desktop, service and event-sourced systems. Its own product,{' '}
          <a href="https://www.all-source.xyz/">AllSource</a>, provides public material on event
          storage and replay. These establish relevant technical context; they do not replace
          examining the specific system under review.
        </p>
        <p>
          If the primary need is to make changes with the existing team, consider{' '}
          <Link href="/services/rust-consulting">Rust consulting and architecture review</Link>. A
          diligence assessment can identify implementation work, but that work requires an agreed
          scope rather than being assumed to be included in the report.
        </p>
      </section>
    </ServicePage>
  )
}

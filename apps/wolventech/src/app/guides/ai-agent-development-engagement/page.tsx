import ServicePage from '@/components/ServicePage'
import type { Metadata } from 'next'

const title = 'What an AI agent development engagement should deliver'
const description =
  'A buyer’s guide to agent scope, permissions, acceptance evidence and handover for a production AI workflow.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/guides/ai-agent-development-engagement' },
  openGraph: {
    type: 'article',
    title,
    description,
    url: '/guides/ai-agent-development-engagement',
  },
}

export default function AgentDevelopmentGuide() {
  return (
    <ServicePage
      title={title}
      intro="An agent that can call a tool can also call the wrong tool, use stale information or fail halfway through a workflow. Before commissioning one, agree what it may do and the evidence needed for handover."
      relatedHref="/services/rust-consulting"
      relatedLabel="Rust consulting and architecture review"
    >
      <section>
        <h2>Listen: hiring an AI engineer</h2>
        <p>
          Listen to an AI-generated discussion of the hiring and delivery questions in this guide.
        </p>
        {/* biome-ignore lint/a11y/useMediaCaption: A verified transcript is not yet available. */}
        <audio
          controls
          preload="none"
          className="w-full"
          aria-label="Hiring an AI engineer audio discussion"
          src="/ai-engineer-hiring-audio.m4a"
        >
          Your browser does not support audio playback.
        </audio>
      </section>
      <section>
        <h2>A task with an accountable owner</h2>
        <p>
          Name the person who owns the business process and the action the system should help them
          complete. Define a successful result and what should be escalated. A document-review
          assistant might prepare a sourced draft for a human to check before any decision is sent.
        </p>
        <p>
          Collect ordinary cases, ambiguous cases and known failures. These examples form a basis
          for evaluating the workflow. A fluent answer does not establish that the answer is
          correct.
        </p>
      </section>
      <section>
        <h2>Explicit access and approval boundaries</h2>
        <p>
          List the systems the agent can read and the actions it can take. Separate read access from
          writes. For consequential actions, identify who approves the action and what information
          they see before approving it.
        </p>
        <p>
          The <a href="https://github.com/modelcontextprotocol/servers">MCP reference servers</a>{' '}
          illustrate protocol features, but their maintainers describe them as educational examples,
          not production-ready systems.{' '}
          <a href="https://github.com/microsoft/playwright-mcp">Playwright MCP</a> enables browser
          automation, while its maintainers state that it is not a security boundary. Discuss those
          limits before a tool gains access to business systems.
        </p>
      </section>
      <section>
        <h2>Evidence that the workflow works</h2>
        <p>
          Agree representative test cases before accepting delivery. Include missing information,
          rejected permissions, incorrect outputs and interrupted work. Request test results and a
          demonstration of the real path, including human approval where one exists.
        </p>
        <p>
          Record which version was tested and what remained outside the test. A passing build shows
          that software compiled; it does not show that the business workflow ran correctly.
        </p>
      </section>
      <section>
        <h2>Visibility without collecting everything</h2>
        <p>
          An operator should be able to see whether a run started, which step failed and what needs
          attention. Logs and traces support investigation, but introduce data handling decisions.
          Agree what is recorded, who can access it and how long it is retained.
        </p>
        <p>
          The{' '}
          <a href="https://github.com/open-telemetry/opentelemetry-collector">
            OpenTelemetry Collector
          </a>{' '}
          can receive, process and export telemetry to supported backends. It is a component in an
          observability design, not proof that a deployment records or protects the right
          information.
        </p>
      </section>
      <section>
        <h2>Handover the business can use</h2>
        <p>
          At completion, the business should know where the source code lives, how the system is
          deployed, which credentials it depends on, how to disable it and who maintains it. Request
          an operating guide, architecture decisions and a walkthrough using the acceptance cases.
        </p>
        <p>
          The right implementation might be a conventional integration, a purchased product or an
          agent. Build when the work and ongoing integration justify it. A supplier should explain
          when a smaller solution fits.
        </p>
      </section>
    </ServicePage>
  )
}

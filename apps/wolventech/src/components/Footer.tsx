export default function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-[1160px] flex-wrap items-center justify-between gap-4 border-t border-rust-line px-7 pb-8 pt-8 text-[13px] text-rust-muted">
      <div>
        <span className="font-semibold text-rust-ink-soft">wolven-tech</span>
        <span> &nbsp;·&nbsp; a Rust-only technical advisory &nbsp;·&nbsp; operated by </span>
        <a
          href="https://decebaldobrica.com"
          className="text-rust-ink-soft underline-offset-4 hover:underline"
        >
          Decebal Dobrica
        </a>
        <span className="block pt-2">
          <a
            href="https://find-and-update.company-information.service.gov.uk/company/16811183"
            className="text-rust-ink-soft underline-offset-4 hover:underline"
          >
            WOLVEN TECH ADVISORY LTD · company 16811183
          </a>
        </span>
      </div>
      <div>
        © {new Date().getFullYear()} Wolven Tech &nbsp;·&nbsp;{' '}
        <a href="/products" className="text-rust-ink-soft underline-offset-4 hover:underline">
          products
        </a>
        &nbsp;·&nbsp;{' '}
        <a
          href="https://github.com/wolven-tech"
          className="text-rust-ink-soft underline-offset-4 hover:underline"
        >
          github
        </a>
        &nbsp;·&nbsp;{' '}
        <a
          href="https://crates.io/users/decebal"
          className="text-rust-ink-soft underline-offset-4 hover:underline"
        >
          crates.io
        </a>
      </div>
    </footer>
  )
}

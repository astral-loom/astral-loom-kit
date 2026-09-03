const REPO = 'https://github.com/astral-loom'
const NPM_KIT = 'https://www.npmjs.com/package/astral-loom-kit'
const NPM_WIDGETS = 'https://www.npmjs.com/package/astral-loom-widgets'
const DEMO = 'https://astral-loom-widgets.vercel.app'

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          Astral Loom
        </a>
        <div className="nav-links">
          <a href="#toolkit">Kit</a>
          <a href="#toolkit">CLI</a>
          <a href="#toolkit">Widgets</a>
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_KIT} target="_blank" rel="noreferrer" className="nav-cta">
            npm
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">— Open Source Stellar Toolkit —</p>
        <h1>
          The missing toolkit
          <span>for Stellar developers.</span>
        </h1>
        <p className="hero-sub">
          An SDK, CLI, and React component library that removes the repeated
          boilerplate from Stellar dApp development — so you can ship faster.
        </p>
        <div className="hero-ctas">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            View on GitHub
          </a>
          <a href={DEMO} target="_blank" rel="noreferrer" className="btn btn-secondary">
            Try the Live Demo
          </a>
        </div>
      </div>
    </section>
  )
}

function Toolkit() {
  return (
    <section id="toolkit" className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">The Toolkit</p>
          <h2 className="section-title">Three packages, one ecosystem</h2>
          <p className="section-desc">
            Each package solves a different part of the Stellar dApp stack —
            use them together or pick just what you need.
          </p>
        </div>

        <div className="toolkit-grid">
          <div className="toolkit-card">
            <div className="toolkit-icon">🧵</div>
            <div className="toolkit-tag">Core SDK</div>
            <h3>astral-loom-kit</h3>
            <p>
              Unified wallet adapters for Freighter, Albedo, and xBull.
              Transaction builders for payments, batch transfers, and
              trustlines — with human-readable error mapping.
            </p>
            <div className="toolkit-links">
              <a href={`${REPO}/astral-loom-kit`} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={NPM_KIT} target="_blank" rel="noreferrer">
                npm
              </a>
            </div>
          </div>

          <div className="toolkit-card">
            <div className="toolkit-icon">⚡</div>
            <div className="toolkit-tag">Command Line</div>
            <h3>astral-loom-cli</h3>
            <p>
              Create and fund testnet accounts, check balances, and decode
              XDR envelopes — all from your terminal without leaving the
              flow.
            </p>
            <div className="toolkit-links">
              <a href={`${REPO}/astral-loom-cli`} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div className="toolkit-card">
            <div className="toolkit-icon">🧩</div>
            <div className="toolkit-tag">UI Components</div>
            <h3>astral-loom-widgets</h3>
            <p>
              Drop-in React components for Stellar data — balance cards,
              transaction history, payment QR codes, and asset badges.
              Fetches live data from Horizon.
            </p>
            <div className="toolkit-links">
              <a href={`${REPO}/astral-loom-widgets`} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={NPM_WIDGETS} target="_blank" rel="noreferrer">
                npm
              </a>
              <a href={DEMO} target="_blank" rel="noreferrer">
                Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyAstralLoom() {
  const features = [
    {
      icon: '🔑',
      title: 'Unified Wallet Interface',
      desc: 'One adapter interface for Freighter, Albedo, and xBull. Switch wallets without rewriting connection or signing logic.',
    },
    {
      icon: '💬',
      title: 'Human-Readable Errors',
      desc: 'Raw Horizon error codes mapped to clear messages like "Insufficient balance" or "Trustline not established".',
    },
    {
      icon: '⌨️',
      title: 'Batteries Included CLI',
      desc: 'Fund testnet accounts, check balances, and decode XDR — common dev tasks without leaving the terminal.',
    },
    {
      icon: '🧩',
      title: 'Drop-in UI Components',
      desc: 'React components that fetch live Horizon data out of the box. Balance cards, transaction history, and more.',
    },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Why Astral Loom</p>
          <h2 className="section-title">Built for developers, not against them</h2>
          <p className="section-desc">
            Stop re-implementing wallet connections, error parsing, and
            transaction building for every new Stellar project.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <h3>
                <span className="icon">{f.icon}</span>
                {f.title}
              </h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CodeSnippet() {
  return (
    <section className="section">
      <div className="container">
        <div className="code-section">
          <div>
            <p className="section-label">Integration</p>
            <h2 className="section-title">
              Clean APIs,
              <br />
              real transactions
            </h2>
            <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
              Build, sign, and submit Stellar transactions in a few lines.
              The SDK handles account sequencing, fee estimation, and error
              mapping so you can focus on your dApp logic.
            </p>
            <a href={NPM_KIT} target="_blank" rel="noreferrer" className="btn btn-secondary">
              Read the docs →
            </a>
          </div>

          <div className="code-block">
            <div className="code-bar">
              <span className="code-dot" />
              <span className="code-dot" />
              <span className="code-dot" />
              <span className="code-filename">payment.ts</span>
            </div>
            <pre className="code-pre">
              <span className="cm">{'// Build and sign a payment in seconds'}</span>
              {'\n'}
              <span className="kw">import</span>
              {' { '}
              <span className="fn">getNetwork</span>
              {', '}
              <span className="fn">buildPayment</span>
              {' } '}
              <span className="kw">from</span>
              {' '}
              <span className="str">'astral-loom-kit'</span>
              {';'}
              {'\n\n'}
              <span className="kw">const</span>
              {' network = '}
              <span className="fn">getNetwork</span>
              {'('}
              <span className="str">'testnet'</span>
              {');'}
              {'\n\n'}
              <span className="kw">const</span>
              {' tx = '}
              <span className="fn">buildPayment</span>
              {'({'}
              {'\n  '}
              <span className="op">source</span>
              {': sourceKeypair.'}
              <span className="fn">publicKey</span>
              {'(),'}
              {'\n  '}
              <span className="op">sourceSequence</span>
              {': '}
              <span className="str">'1234567890'</span>
              {','}
              {'\n  '}
              <span className="op">destination</span>
              {': '}
              <span className="str">'GDESTINATION...'</span>
              {','}
              {'\n  '}
              <span className="op">assetCode</span>
              {': '}
              <span className="str">'XLM'</span>
              {','}
              {'\n  '}
              <span className="op">amount</span>
              {': '}
              <span className="str">'10'</span>
              {','}
              {'\n  '}
              <span className="op">network</span>
              {': network.name,'}
              {'\n});'}
              {'\n\n'}
              <span className="cm">{'// Sign with any wallet adapter'}</span>
              {'\n'}
              <span className="kw">const</span>
              {' signed = '}
              <span className="kw">await</span>
              {' adapter.'}
              <span className="fn">signTransaction</span>
              {'(tx, network.name);'}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoCallout() {
  return (
    <section className="section">
      <div className="container">
        <div className="demo-callout">
          <p className="section-label">Live Demo</p>
          <h3>See it running on real testnet data</h3>
          <p>
            The widgets demo fetches live balances from the Stellar Horizon
            API — no mock data, no placeholders. Just a public key and real
            network responses.
          </p>
          <a href={DEMO} target="_blank" rel="noreferrer" className="btn btn-primary">
            View Live Demo
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <span className="footer-brand">Astral Loom</span>
          <span className="footer-tagline"> — Built for the Stellar ecosystem</span>
        </div>
        <div className="footer-links">
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_KIT} target="_blank" rel="noreferrer">
            npm (kit)
          </a>
          <a href={NPM_WIDGETS} target="_blank" rel="noreferrer">
            npm (widgets)
          </a>
          <a href={DEMO} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <hr className="divider" />
      <WhyAstralLoom />
      <hr className="divider" />
      <Toolkit />
      <hr className="divider" />
      <DemoCallout />
      <hr className="divider" />
      <CodeSnippet />
      <Footer />
    </>
  )
}

export default App

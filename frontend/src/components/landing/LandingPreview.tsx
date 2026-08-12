/**
 * LandingPreview — polished product preview with browser chrome and live-looking data.
 */

const LandingPreview = () => (
  <section className="lprev" id="preview" aria-label="Product preview">
    <div className="lprev__inner">
      <div className="lprev__header">
        <div className="lprev__eyebrow">See it in action</div>
        <h2 className="lprev__title">Your finances, at a glance</h2>
        <p className="lprev__subtitle">
          A clean, intuitive interface that makes managing your finances feel effortless — not overwhelming.
        </p>
      </div>

      <div className="lprev__frame-wrap">
        {/* Glow effects */}
        <div className="lprev__glow lprev__glow--1" aria-hidden="true" />
        <div className="lprev__glow lprev__glow--2" aria-hidden="true" />

        {/* Browser chrome */}
        <div className="lprev__browser">
          <div className="lprev__browser-bar">
            <div className="lprev__browser-dots" aria-hidden="true">
              <span className="lprev__dot lprev__dot--red" />
              <span className="lprev__dot lprev__dot--yellow" />
              <span className="lprev__dot lprev__dot--green" />
            </div>
            <div className="lprev__browser-url">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="2" y="5" width="12" height="9" rx="1.5" /><path d="M5 5V4a3 3 0 016 0v1" /></svg>
              app.fundwave.io/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="lprev__content">
            {/* Sidebar mockup */}
            <div className="lprev__sidebar">
              <div className="lprev__sidebar-logo">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
                  <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>FundWave</span>
              </div>
              {['Dashboard', 'Transactions', 'Savings', 'AI Insights', 'Profile'].map((item, i) => (
                <div key={item} className={`lprev__nav-item ${i === 0 ? 'lprev__nav-item--active' : ''}`}>
                  <div className="lprev__nav-dot" />
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="lprev__main">
              {/* Header row */}
              <div className="lprev__header-row">
                <div>
                  <div className="lprev__greeting">Good morning, Priya 👋</div>
                  <div className="lprev__date">Sunday, August 9, 2026</div>
                </div>
              </div>

              {/* KPI cards */}
              <div className="lprev__kpis">
                {[
                  { label: 'Balance', value: '₹2,45,000', delta: '+8.4%', up: true, color: 'var(--color-primary)' },
                  { label: 'Income', value: '₹85,000', delta: '+12.1%', up: true, color: 'var(--color-success)' },
                  { label: 'Expenses', value: '₹34,200', delta: '-3.2%', up: false, color: 'var(--color-danger)' },
                  { label: 'Saved', value: '₹12,500', delta: '+21.5%', up: true, color: 'var(--color-secondary)' },
                ].map(k => (
                  <div key={k.label} className="lprev__kpi-card">
                    <div className="lprev__kpi-label">{k.label}</div>
                    <div className="lprev__kpi-value" style={{ color: k.color }}>{k.value}</div>
                    <div className="lprev__kpi-delta" style={{ color: k.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {k.delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="lprev__charts">
                {/* Bar chart */}
                <div className="lprev__chart-card">
                  <div className="lprev__chart-title">Monthly Income vs Expenses</div>
                  <div className="lprev__bars">
                    {[50, 40, 65, 45, 70, 55, 80].map((h, i) => (
                      <div key={i} className="lprev__bar-pair">
                        <div className="lprev__bar-i" style={{ height: `${h}%` }} />
                        <div className="lprev__bar-e" style={{ height: `${h * 0.42}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="lprev__legend">
                    <span><i className="lprev__leg-dot" style={{ background: 'var(--color-success)' }} />Income</span>
                    <span><i className="lprev__leg-dot" style={{ background: 'var(--color-danger)' }} />Expenses</span>
                  </div>
                </div>

                {/* Savings ring */}
                <div className="lprev__chart-card">
                  <div className="lprev__chart-title">Emergency Fund</div>
                  <div className="lprev__ring-wrap">
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="35" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                      <circle cx="45" cy="45" r="35" fill="none" stroke="var(--color-success)" strokeWidth="8"
                        strokeDasharray="146 220" strokeLinecap="round" transform="rotate(-90 45 45)" />
                      <text x="45" y="48" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--color-text)">66%</text>
                    </svg>
                    <div className="lprev__ring-info">
                      <div className="lprev__ring-saved">₹1,98,000 saved</div>
                      <div className="lprev__ring-goal">Goal: ₹3,00,000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="lprev__txns">
                <div className="lprev__txns-title">Recent Transactions</div>
                {[
                  { icon: '🛒', name: 'Grocery Store', cat: 'Food', amount: '-₹2,450', inc: false },
                  { icon: '💼', name: 'Freelance Project', cat: 'Income', amount: '+₹15,000', inc: true },
                  { icon: '🎬', name: 'Netflix', cat: 'Entertainment', amount: '-₹649', inc: false },
                ].map((tx, i) => (
                  <div key={i} className="lprev__tx">
                    <span className="lprev__tx-icon">{tx.icon}</span>
                    <div className="lprev__tx-info">
                      <div className="lprev__tx-name">{tx.name}</div>
                      <div className="lprev__tx-cat">{tx.cat}</div>
                    </div>
                    <span className={`lprev__tx-amount ${tx.inc ? 'lprev__tx-amount--inc' : ''}`}>{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </section>
);

export default LandingPreview;

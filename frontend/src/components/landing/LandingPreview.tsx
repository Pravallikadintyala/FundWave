/**
 * LandingPreview — a product preview showing the FundWave dashboard aesthetic.
 *
 * This is a visual mockup using the existing design system, not actual data.
 */

const LandingPreview = () => (
  <section className="landing-preview" aria-label="Product preview">
    <div className="landing-preview__container">
      <div className="landing-preview__header">
        <h2>See FundWave in action</h2>
        <p>
          A clean, intuitive interface that makes managing your finances feel effortless.
        </p>
      </div>

      <div className="landing-preview__mockup">
        {/* Dashboard frame */}
        <div className="landing-preview__frame">
          {/* Header */}
          <div className="landing-preview__frame-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-primary)" aria-hidden="true">
              <rect width="20" height="20" rx="4" />
              <path d="M6 10h8M10 6l3 4-3 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="landing-preview__frame-title">FundWave</span>
          </div>

          {/* Content grid */}
          <div className="landing-preview__content">
            {/* KPI cards */}
            <div className="landing-preview__kpi-row">
              {[
                { label: 'Balance', value: '₹2,45,000' },
                { label: 'Income', value: '₹85,000' },
                { label: 'Expenses', value: '₹34,200' },
                { label: 'Saved', value: '₹12,500' },
              ].map(card => (
                <div key={card.label} className="landing-preview__kpi-card">
                  <span className="landing-preview__kpi-label">{card.label}</span>
                  <span className="landing-preview__kpi-value">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Charts section */}
            <div className="landing-preview__charts">
              {/* Income vs Expense chart mockup */}
              <div className="landing-preview__chart">
                <div className="landing-preview__chart-header">Monthly Income vs Expenses</div>
                <div className="landing-preview__chart-bars">
                  {[40, 35, 50, 45, 60, 55, 65].map((h, i) => (
                    <div key={i} className="landing-preview__bar-group">
                      <div className="landing-preview__bar landing-preview__bar--income" style={{ height: `${h * 0.6}%` }} />
                      <div className="landing-preview__bar landing-preview__bar--expense" style={{ height: `${h * 0.4}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings goal ring */}
              <div className="landing-preview__chart">
                <div className="landing-preview__chart-header">Savings Progress</div>
                <div className="landing-preview__ring-container">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="landing-preview__ring">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="var(--color-success)"
                      strokeWidth="6"
                      strokeDasharray="94.2 188.4"
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                    <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--color-text)">
                      50%
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Transactions mockup */}
            <div className="landing-preview__transactions">
              <div className="landing-preview__tx-header">Recent Transactions</div>
              {[
                { icon: '🛒', desc: 'Grocery Store', amount: '-₹2,450' },
                { icon: '💼', desc: 'Project Income', amount: '+₹15,000' },
                { icon: '🎬', desc: 'Entertainment', amount: '-₹800' },
              ].map((tx, i) => (
                <div key={i} className="landing-preview__tx-item">
                  <span className="landing-preview__tx-icon">{tx.icon}</span>
                  <span className="landing-preview__tx-desc">{tx.desc}</span>
                  <span className={`landing-preview__tx-amount ${tx.amount.startsWith('+') ? 'landing-preview__tx-amount--income' : ''}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="landing-preview__glow landing-preview__glow--1" aria-hidden="true" />
        <div className="landing-preview__glow landing-preview__glow--2" aria-hidden="true" />
      </div>
    </div>
  </section>
);

export default LandingPreview;

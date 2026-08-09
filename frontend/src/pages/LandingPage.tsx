/**
 * LandingPage — the public landing/marketing page for FundWave.
 *
 * Assembled from modular components:
 *  - Navigation (logo, features link, auth CTAs)
 *  - Hero (headline, supporting text, dual CTAs, visual)
 *  - Features (4 core features in a grid)
 *  - Preview (product mockup)
 *  - Footer (links, copyright, CTAs)
 */

import LandingNavigation from '@/components/landing/LandingNavigation';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage = () => (
  <div className="landing-page">
    <LandingNavigation />
    <main className="landing-main" role="main">
      <LandingHero />
      <LandingFeatures />
      <LandingPreview />
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;

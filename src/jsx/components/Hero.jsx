import ButtonAnchor from '@unctad-infovis/general-tools/components/ButtonAnchor.jsx';
import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';

import NavCard from './NavCard.jsx';
import './Hero.css';

const Hero = ({ meta }) => {
  const { title, logo_url, description, background_image_url, cta, show_cta, show_nav_cards, nav_cards, pills } = meta.hero;

  return (
    <div className="hero_wrapper">
      <section className="hero" id="hero" style={background_image_url ? { backgroundImage: `url(${resolveAsset(background_image_url)})` } : undefined}>
        <div className="hero_content">
          <div className="hero_heading">
            <h1 className="hero_title">
              {// The official GTU logo, exported as a PNG by the designer (tmp/Logo_GTU_officiel.png,
              // copied into public assets) – replaces a text-rendered title so the wordmark matches
              // the brand asset exactly. Its own accent bar and two-line layout are baked into the image.
              <img alt={title} src={resolveAsset(logo_url)} /> }
            </h1>
            <p className="hero_description">{description}</p>
          </div>
          {// "Read the update" CTA is disabled for now but kept wired up behind `show_cta`
          // in meta.json so it can come back without rework.
          show_cta && <ButtonAnchor className="hero_cta" text={cta.label} url={cta.target_selector} />}
        </div>
        {// Nav-cards/pills live inside `.hero` itself (a normal flex-column child, not an
        // overlapping sibling pulled up with a negative margin) so that when they wrap to
        // extra rows on narrow screens, `.hero`'s own min-height simply grows to fit them —
        // matching 2026-wir_report's pattern, where its background-image container has no
        // fixed height either. The old overlap approach pinned the row's top edge a fixed
        // distance above the image's (fixed-height) bottom edge, so a 2nd or 3rd wrapped row
        // extended past the image onto the plain page background below it.
        // Photo nav cards are disabled for now (in favour of the pill row below) but kept
        // wired up behind `show_nav_cards` in meta.json so they can come back without rework.
        show_nav_cards ? (
          <div className="hero_nav_cards">
            {nav_cards.map(card => (
              <NavCard image_url={card.image_url} key={card.label} label={card.label} target_selector={card.target_selector} />
            ))}
          </div>
        ) : (
          <div className="hero_pills">
            {pills.map(pill => (
              // External links (e.g. "Subscribe") render as plain text links, not pill buttons –
              // `pill.url` (vs. `pill.target_selector`) distinguishes the two; ButtonAnchor itself
              // already renders an <a> instead of a <button> whenever the url contains "https".
              <ButtonAnchor className={pill.url ? 'hero_link' : 'hero_pill'} key={pill.label} text={pill.label} url={pill.url ?? pill.target_selector} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Hero;

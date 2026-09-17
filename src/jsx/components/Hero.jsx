import ButtonAnchor from '@unctad-infovis/general-tools/components/ButtonAnchor.jsx';
import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';

import NavCard from './NavCard.jsx';
import './Hero.css';

const Hero = ({ meta }) => {
  const { title, description, background_image_url, cta, show_cta, show_nav_cards, nav_cards, pills } = meta.hero;

  return (
    // The nav-cards/pills row overlaps up into the hero's own bottom padding via a negative
    // margin-top, so it and `.hero` were adjacent siblings with adjoining margins — any
    // margin-bottom applied from outside (e.g. a Drupal "Additional CSS class" on this embed)
    // collapsed straight into that negative margin and got cancelled out instead of adding
    // visible space. This wrapper contains the overlap in its own block formatting context
    // (via `overflow: hidden`, which doesn't clip anything here since nothing escapes its
    // box) so an external margin-bottom on `.hero_wrapper` behaves normally again.
    <div className="hero_wrapper">
      <section className="hero" id="hero" style={background_image_url ? { backgroundImage: `url(${resolveAsset(background_image_url)})` } : undefined}>
        <div className="hero_content">
          <h1 className="hero_title">{title}</h1>
          <p className="hero_description">{description}</p>
          {// "Read the update" CTA is disabled for now but kept wired up behind `show_cta`
          // in meta.json so it can come back without rework.
          show_cta && <ButtonAnchor className="hero_cta" text={cta.label} url={cta.target_selector} />}
        </div>
      </section>
      {// Photo nav cards are disabled for now (in favour of the pill row below) but kept
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
            <ButtonAnchor className="hero_pill" key={pill.label} text={pill.label} url={pill.target_selector} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;

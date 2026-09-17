import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';
import { useEffect, useState } from 'react';

import './NavCard.css';

// ButtonAnchor (general-tools) can't render an image + label, so this reimplements
// its exists-check/scroll-to-selector behaviour locally for the richer card markup.
const NavCard = ({ label, image_url, target_selector }) => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const check = () => setExists(!!document.querySelector(target_selector));

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [target_selector]);

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(target_selector)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  if (!exists) return null;

  return (
    <button aria-label={label} className="nav_card" onClick={handleClick} type="button">
      <span className="nav_card_label">{label}</span>
      {image_url ? <span className="nav_card_photo" style={{ backgroundImage: `url(${resolveAsset(image_url)})` }} /> : <span className="nav_card_photo nav_card_photo--empty">Photo</span>}
      <span aria-hidden="true" className="nav_card_arrow">
        ↓
      </span>
    </button>
  );
};

export default NavCard;

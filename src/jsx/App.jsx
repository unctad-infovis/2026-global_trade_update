import { useRef } from 'react';

import '@unctad-infovis/general-tools/styles/styles.css';

import Hero from './components/Hero.jsx';

// Article.mdx is unused by this project — all copy for the hero, stats strip and
// global-trade-snapshot entries lives in meta.json (short structured UI strings, not
// long-form narrative), see src/meta.json.

const App = ({ meta }) => {
  const appRef = useRef();

  window.appRef = appRef;

  return (
    <div
      className="app"
      style={{
        // No design token maps to pure black — same exception already made for
        // .global_trade_snapshot_title's color, see GlobalTradeSnapshot.css.
        '--main-color': '#000',
        '--secondary-color': 'var(--un-color-grey-darkest)'
      }}
      ref={appRef}
    >
      <Hero meta={meta} />
    </div>
  );
};

export default App;

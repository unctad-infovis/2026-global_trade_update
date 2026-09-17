import { createRoot } from 'react-dom/client';

import '@unctad-infovis/general-tools/styles/styles.css';

import meta from './../meta.json';
import StatsStrip from './components/StatsStrip.jsx';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}-stats-strip`);
createRoot(container).render(
  <div className="app">
    <StatsStrip meta={meta.stats_strip} />
  </div>
);

import { createRoot } from 'react-dom/client';

import '@unctad-infovis/general-tools/styles/styles.css';

import meta from './../meta.json';
import GlobalTradeSnapshot from './components/GlobalTradeSnapshot.jsx';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}-global-trade-snapshot`);
createRoot(container).render(
  <div className="app">
    <GlobalTradeSnapshot meta={meta.global_trade_snapshot} />
  </div>
);

import ChartDataWrapper from '@unctad-infovis/general-tools/components/ChartDataWrapper.jsx';
import { useState } from 'react';

import TabSwitcher from './TabSwitcher.jsx';
import './GlobalTradeSnapshot.css';

const GlobalTradeSnapshot = ({ meta }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="global_trade_snapshot global-trade-snapshot">
      <div className="global_trade_snapshot_content">
        <div className="global_trade_snapshot_header">
          <div className="global_trade_snapshot_heading">
            <h2 className="global_trade_snapshot_title">{meta.title}</h2>
            {meta.description && <p className="global_trade_snapshot_description">{meta.description}</p>}
          </div>
          <TabSwitcher activeIndex={activeIndex} onChange={setActiveIndex} tabs={meta.tabs} />
        </div>
        {meta.tabs.map((tab, index) => (
          // All tabs mount once and stay mounted — toggling `hidden` instead of conditionally
          // rendering avoids unmount/remount on every switch, which briefly collapsed this
          // area's height and made the browser clamp scroll position back up the page.
          // ChartDataWrapper only starts loading once its own container is visible, so a
          // hidden tab's chart doesn't load until it's actually selected.
          // Keyed on label, not chart_id — several tabs can share the same chart_id (e.g.
          // while real per-tab charts are pending) and chart_id must stay unique as a key.
          <div className="global_trade_snapshot_chart" hidden={index !== activeIndex} key={tab.label}>
            <ChartDataWrapper chart_id={tab.chart_id} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GlobalTradeSnapshot;

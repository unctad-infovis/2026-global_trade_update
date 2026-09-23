import ChartDataWrapper from '@unctad-infovis/general-tools/components/ChartDataWrapper.jsx';
import { useEffect, useState } from 'react';

import parseTsv from '../helpers/ParseTsv.js';
import TabSwitcher from './TabSwitcher.jsx';
import './GlobalTradeSnapshot.css';

const GlobalTradeSnapshot = ({ meta }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // 'tabs' (default) shows one chart at a time behind a tab switcher; 'grid' shows all
  // charts side by side (stacking to one column on narrow screens) with no tab switcher.
  // Both stay wired up so switching is a one-line meta.json change, not a rewrite.
  const layout = meta.layout === 'grid' ? 'grid' : 'tabs';
  // The download link's target lives in a row of the same Datawrapper table the Stats strip
  // already reads (rather than a build-time URL), so a new release only needs that table
  // updated — no code or meta.json change, matching the CSV-driven pattern used there.
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (!meta.download?.csv_url) return;

    fetch(meta.download.csv_url)
      .then(response => response.text())
      .then(text => {
        const rows = parseTsv(text);
        const row = rows.find(r => r[meta.download.match.column] === meta.download.match.value);
        setDownloadUrl(row?.[meta.download.value_column] || null);
      })
      .catch(error => console.error(error));
  }, [meta.download]);

  return (
    <section className="global_trade_snapshot global-trade-snapshot">
      <div className="global_trade_snapshot_content">
        <div className="global_trade_snapshot_header">
          <div className="global_trade_snapshot_heading">
            <h2 className="global_trade_snapshot_title">{meta.title}</h2>
            {meta.description && (
              <p className="global_trade_snapshot_description">
                {meta.description}
                {meta.download && downloadUrl && (
                  <>
                    {' '}
                    <a className="global_trade_snapshot_download" href={downloadUrl} rel="noreferrer" target="_blank">
                      {meta.download.label}
                    </a>
                    .
                  </>
                )}
              </p>
            )}
          </div>
          {layout === 'tabs' && <TabSwitcher activeIndex={activeIndex} onChange={setActiveIndex} tabs={meta.tabs} />}
        </div>
        <div className={`global_trade_snapshot_charts global_trade_snapshot_charts--${layout}`}>
          {meta.tabs.map((tab, index) => (
            // In 'tabs' layout, all tabs mount once and stay mounted — toggling `hidden` instead
            // of conditionally rendering avoids unmount/remount on every switch, which briefly
            // collapsed this area's height and made the browser clamp scroll position back up
            // the page. In 'grid' layout nothing is ever hidden, so this is always false there.
            // ChartDataWrapper only starts loading once its own container is visible, so a
            // hidden tab's chart doesn't load until it's actually selected.
            // Keyed on label, not chart_id — several tabs can share the same chart_id (e.g.
            // while real per-tab charts are pending) and chart_id must stay unique as a key.
            <div className="global_trade_snapshot_chart" hidden={layout === 'tabs' && index !== activeIndex} key={tab.label}>
              {layout === 'grid' && <p className="global_trade_snapshot_chart_label">{tab.label}</p>}
              <ChartDataWrapper chart_id={tab.chart_id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalTradeSnapshot;

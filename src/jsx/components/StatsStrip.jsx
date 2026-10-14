import useCountUp from '@unctad-infovis/general-tools/helpers/UseCountUp.js';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';
import { useEffect, useState } from 'react';

import formatNumber from '../helpers/FormatNumber.js';
import parseFormattedValue from '../helpers/ParseFormattedValue.js';
import parseTsv from '../helpers/ParseTsv.js';
import resolveDatawrapperCsvUrl from '../helpers/ResolveDatawrapperCsvUrl.js';
import './StatsStrip.css';

// Tile styling ported from 2026-beyond_gdp's StatTiles (same card/count-up language) —
// useCountUp's `decimals` option (unused there, since its tiles are whole numbers) is what
// we need here for percentage stats.
const StatTile = ({ delay, label, prefix, suffix, decimals, numeric, url }) => {
  const [current, ref] = useCountUp(numeric ?? 0, { decimals });
  const content =
    numeric != null ? (
      <>
        <p className="stats_strip_value">
          {prefix}
          {formatNumber(current, decimals)}
          {suffix}
        </p>
        <p className="stats_strip_label">{label}</p>
      </>
    ) : (
      <>
        <p className="stats_strip_unavailable">Data not available</p>
        <p className="stats_strip_label">{label}</p>
      </>
    );

  return url ? (
    <a className="stats_strip_tile stats_strip_tile--link" href={url} ref={ref} rel="noreferrer" style={{ transitionDelay: `${delay}ms` }} target="_blank">
      {content}
    </a>
  ) : (
    <div className="stats_strip_tile" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {content}
    </div>
  );
};

const StatsStrip = ({ meta }) => {
  const [rows, setRows] = useState(null);
  const [gridRef, inView] = useIsVisible(0.3);

  useEffect(() => {
    if (!meta.datawrapper_chart_id) return;

    resolveDatawrapperCsvUrl(meta.datawrapper_chart_id)
      .then(csvUrl => fetch(csvUrl))
      .then(response => response.text())
      .then(text => setRows(parseTsv(text)))
      .catch(error => console.error(error));
  }, [meta.datawrapper_chart_id]);

  const stats = meta.stats
    .map(stat => {
      const row = rows?.find(r => r[stat.match.column] === stat.match.value);
      // A raw value of "false" marks a reserved card slot (e.g. a stat pending confirmation) —
      // skip it entirely rather than showing an "unavailable" tile.
      if (row?.[stat.value_column] === 'false') return null;
      // The whole formatted figure (e.g. "$3.8T", "35%") lives in the Datawrapper cell, not
      // meta.json — this parses out the bare number to animate plus the prefix/suffix/decimals
      // to render around it, so a formatting change only requires editing the table.
      const formatted = parseFormattedValue(row?.[stat.value_column]);
      // The tile caption also comes from the Datawrapper table when `label_column` is set
      // (it changes monthly along with the figure), falling back to the static meta.json
      // label if that column/row isn't present yet.
      const label = (stat.label_column && row?.[stat.label_column]) || stat.label;
      return { ...stat, label, numeric: formatted?.numeric, prefix: formatted?.prefix, suffix: formatted?.suffix, decimals: formatted?.decimals };
    })
    .filter(Boolean);

  return (
    <div className={`stats_strip_grid${inView ? ' stats_strip_grid--inview' : ''}`} id="stats-strip" ref={gridRef}>
      {stats.map((stat, idx) => (
        // Keying on readiness (not just the label) forces a remount once the CSV fetch resolves —
        // useCountUp's animation starts on first visibility and never restarts, so if a tile scrolls
        // into view before `numeric` arrives, it must remount rather than reuse the stale instance.
        <StatTile decimals={stat.decimals} delay={idx * 150} key={`${stat.label}-${stat.numeric ?? 'pending'}`} label={stat.label} numeric={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} url={stat.url} />
      ))}
    </div>
  );
};

export default StatsStrip;

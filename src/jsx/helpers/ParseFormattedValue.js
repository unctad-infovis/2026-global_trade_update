import parseLocaleNumber from './ParseLocaleNumber.js';

// Splits a Datawrapper cell entered as a fully-formatted stat (e.g. "$3.8T", "35%") into the
// pieces StatTile needs: the bare number to animate, plus the prefix/suffix/decimals to render
// around it exactly as entered. This keeps all formatting decisions in the Datawrapper table —
// updating a stat's unit, currency symbol or decimal precision never requires a code/meta.json change.
const parseFormattedValue = raw => {
  if (raw == null) return null;

  const value = raw.toString().trim();
  const match = value.match(/[-+]?\d[\d.,\s]*/);
  if (!match) return null;

  const numericText = match[0].trim();
  const numeric = parseLocaleNumber(numericText);
  if (numeric == null) return null;

  // Not trimmed: keeps whatever spacing the author put between the prefix/suffix and the
  // number itself (e.g. "Up to 16.1%" needs a space, "$3.8T" doesn't) exactly as entered.
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + match[0].length);
  const decimalSeparator = numericText.includes('.') ? '.' : numericText.includes(',') ? ',' : null;
  const decimals = decimalSeparator ? numericText.split(decimalSeparator).pop().length : 0;

  return { prefix, numeric, suffix, decimals };
};

export default parseFormattedValue;

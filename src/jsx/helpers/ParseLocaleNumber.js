// Datawrapper table cells come formatted per-chart locale settings — some tables use a
// dot decimal ("858688038.6"), others a comma decimal with no thousands separator
// ("60,92"). Comma+dot together is treated as thousands+decimal ("1,234.5").
const parseLocaleNumber = raw => {
  if (raw == null || raw === '') return null;

  const value = raw.toString().trim();
  const hasComma = value.includes(',');
  const hasDot = value.includes('.');

  const normalized = hasComma && hasDot ? value.replace(/,/g, '') : hasComma ? value.replace(',', '.') : value;

  const number = Number.parseFloat(normalized);
  return Number.isNaN(number) ? null : number;
};

export default parseLocaleNumber;

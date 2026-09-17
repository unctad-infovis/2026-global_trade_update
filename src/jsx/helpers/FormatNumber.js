// House style: numbers rendered inside a chart/tile/table use a space as the thousands
// separator, never a comma — comma stays reserved for prose. Unlike general-tools's
// CsvToJson-adjacent FormatNr (comma by default), this also respects a decimals count.
const formatNumber = (value, decimals = 0) => value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace(/,/g, ' ');

export default formatNumber;

// Datawrapper's dataset.csv endpoint is tab-delimited, not comma-delimited —
// @unctad-infovis/general-tools's CsvToJson.js assumes commas and would mis-parse it.
const parseTsv = tsv => {
  const lines = tsv
    .toString()
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter(line => line.trim() !== '');
  const headers = lines[0].split('\t').map(h => h.replace(/"/g, '').trim());

  return lines.slice(1).map(line => {
    const cells = line.split('\t').map(cell => cell.replace(/"/g, '').trim());
    return Object.fromEntries(headers.map((header, i) => [header, cells[i]]));
  });
};

export default parseTsv;

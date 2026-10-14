// Datawrapper's dataset.csv export is version-pinned (e.g. /YmLLe/6/dataset.csv) with no public
// "latest" alias. But the chart's bare base URL (https://datawrapper.dwcdn.net/{chartId}/) is a
// tiny stub Datawrapper rewrites on every publish to point at the current version — resolving
// that first means a table republish never requires a meta.json or code change here.
const resolveDatawrapperCsvUrl = async chartId => {
  const response = await fetch(`https://datawrapper.dwcdn.net/${chartId}/`);
  const html = await response.text();
  const match = html.match(new RegExp(`${chartId}/(\\d+)/`));
  if (!match) throw new Error(`Could not resolve the latest published version for Datawrapper chart ${chartId}`);

  return `https://datawrapper.dwcdn.net/${chartId}/${match[1]}/dataset.csv`;
};

export default resolveDatawrapperCsvUrl;

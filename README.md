# 2026-global_trade_update

**Live demo** https://unctad-infovis.github.io/2026-global_trade_update/hero.html

## About

Global Trade Update (GTU) is a monthly UNCTAD report series, alternating between a topic-driven "Monthly policy insights" edition and a standard "Global trade snapshot" edition released three times a year. This project is the landing page for the series on unctad.org, built as three independently embeddable widgets rather than one full page: a static **Hero** (title, description, "Read the update" CTA and two anchor nav cards), a data-driven **Stats strip** (three headline figures fetched client-side from a Datawrapper-hosted CSV table the division maintains), and a tabbed **Global trade snapshot** chart section (genuine Datawrapper chart embeds behind a tab switcher). Everything else on the landing page — the latest-publication teaser, news, video, newsletter signup — is native Drupal content placed by editors around these three embeds; this codebase contains no Drupal-block integration code.

## Embedding

Update the `?v=` query parameter on the entry `.js`/`.css` files below to match the current build version to bust the cache. Don't add a `?v=` to (or hand-write a `modulepreload` link for) the shared chunk file(s) each entry imports internally (visible in dist/dev output as e.g. `2026-global_trade_update.styles-XXXXXXXX.js`) — their filename carries a content hash that changes on every build specifically so they never need manual versioning; a query string on that file would do nothing anyway, since each entry's own `import` statement for it is a bare, query-string-less path that the browser resolves independently of whatever the outer `<script>` tag's URL says. (This was the actual cause of a real incident: bumping `?v=` on the entry scripts alone did not surface a content fix, because the fix lived in this shared chunk — only rebuilding with a new content hash, i.e. a genuinely new URL, fixed it.) The snippets below therefore only preload the entry's own CSS, not the shared JS chunk; the browser fetches that automatically and correctly when the entry script's `import` executes.

All three embeds share the `app-root-2026-global_trade_update` **class** (a project-wide styling hook), but each needs its own **id** — `-hero`, `-stats-strip`, `-global-trade-snapshot` — because all three sit on the same Drupal page at once; reusing one id across them would make `getElementById` resolve to only the first and leave the others unmounted.

The `storage.unctad.org` CDN only returns `Access-Control-Allow-Origin` for the `https://unctad.org` origin specifically (same restriction as every other project hosted there, e.g. `2026-wir_report`) — since `<script type="module">` always fetches cross-origin in CORS mode, these snippets will fail to load silently (no console error, requests just come back without the CORS header) if pasted into a test page served from any other origin, including `localhost`. Test embedding changes on an actual unctad.org page, not a local HTML file.

### Hero

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-global_trade_update/js/2026-global_trade_update.hero.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_styles.min.css?v=1">
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_hero.min.css?v=1">
<div class="app-root-2026-global_trade_update" id="app-root-2026-global_trade_update-hero">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

The hero's "Read the update" CTA and its two nav cards ("Monthly policy insights", "Global trade snapshot") smooth-scroll to in-page selectors configured in `src/meta.json` (`hero.cta.target_selector`, `hero.nav_cards[].target_selector`). These are **class** selectors, not ids — `.current-issue`, `.policy-insights` and `.global-trade-snapshot` — unlike the app-root containers above, which do use ids. `.global-trade-snapshot` matches this project's own Global trade snapshot embed (its outer `<section>` carries a `global-trade-snapshot` class alongside its styling class); `.current-issue` and `.policy-insights` require an editor to add a matching "Additional CSS class" (via Layout Builder's block configuration, if exposed for that block type) to the "current issue" teaser and "Monthly policy insights" Drupal blocks respectively — these two block placements otherwise expose no stable, unique selector at all (their auto-generated element id changes on every single page load, and both placements share one identical class since they're the same reusable block type). A nav card whose target isn't present on the page yet simply doesn't render (no dead links). Each nav card's photo comes from `hero.nav_cards[].image_url` in `src/meta.json` (a static per-type image, not pulled from Drupal) — it falls back to an empty "Photo" placeholder when unset. `public/assets/img/2026-global_trade_update_nav_policy_insights.jpg` and `2026-global_trade_update_nav_global_trade_snapshot.jpg` are **placeholders** — free-license (Unsplash License, no attribution required) stock photos, not final UNCTAD imagery — swap them for real photography before launch:
* Policy insights: ["Colorful cargo ship headed out to sea"](https://unsplash.com/photos/FPKnAO-CF6M) by Venti Views
* Global trade snapshot: ["Dar Es Salaam Port Harbour"](https://unsplash.com/photos/Annl9CjEaEs) by Ali Mkumbwa

### Stats strip

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-global_trade_update/js/2026-global_trade_update.stats-strip.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_styles.min.css?v=1">
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_stats_strip.min.css?v=1">
<div class="app-root-2026-global_trade_update" id="app-root-2026-global_trade_update-stats-strip">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Reads its three figures from the Datawrapper CSV at `src/meta.json`'s `stats_strip.csv_url`, mapped via `stats_strip.stats[]`. Update both to match the division's actual Datawrapper table before deploying. Tile styling (light-blue card, count-up number, uppercase label, decorative arrow) is ported from `2026-beyond_gdp`'s `StatTiles` component — each `stats_strip.stats[]` entry may also set an optional `url` to make its tile a clickable external link (adds the small link icon bottom-right), matching that component's own optional-link behaviour; unset by default.

### Global trade snapshot

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2026-global_trade_update/js/2026-global_trade_update.global-trade-snapshot.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_styles.min.css?v=1">
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2026-global_trade_update/css/2026-global_trade_update_global_trade_snapshot.min.css?v=1">
<div class="app-root-2026-global_trade_update" id="app-root-2026-global_trade_update-global-trade-snapshot">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Renders one Datawrapper chart embed per tab, configured via `src/meta.json`'s `global_trade_snapshot.tabs[]` (`label` + `chart_id`). Each Datawrapper chart supplies its own title/subtitle/source/note/"Get the data"/"Download image" footer — nothing extra is rendered around it.

`global_trade_snapshot.layout` switches between two ready-to-use layouts — `"tabs"` (default) shows one chart at a time behind a tab switcher; `"grid"` shows all charts side by side with no tab switcher, stacking to one column under 900px width. Both stay fully wired up regardless of which is active, so toggling is a one-line `meta.json` change, not a rebuild of either.

The "Download the latest facts and figures edition" link at the end of the section's description is read from the *same* Datawrapper table the Stats strip already fetches (`global_trade_snapshot.download.csv_url`, defaulting to `stats_strip.csv_url`) — specifically a row where `global_trade_snapshot.download.match.column` (`"Date"` by default) equals `global_trade_snapshot.download.match.value` (`"download_url"` by default), read from the `global_trade_snapshot.download.value_column` column (`"url"` by default). That row doesn't exist in the table yet — the division needs to add a `download_url` row with the PDF link in a `url` column before this link will appear; until then it's simply omitted (no dead link). This mirrors the Stats strip's design: a new release only means updating that Datawrapper table, never this code.

> Named "Facts and figures" until 2026-09-16 — every file, class, and identifier tied to this widget was renamed to "Global trade snapshot" to match, including ones with no end-user visibility (component/entry filenames, CSS class names, the `meta.json` key). If you're updating an existing Drupal embed of this widget, its script/CSS URLs and container id all changed — the old `2026-global_trade_update.facts-and-figures.min.js` etc. paths are gone; replace the whole snippet with the one above rather than just bumping `?v=`.

### Local preview

Root `index.html` (dev-only — not a build entry, never deployed; the three snippets above are what actually ships) combines all three embeds on one page with stand-in blocks where Drupal's own View blocks would sit, so the full page can be previewed at once during `npm run start` at http://localhost:8080/ instead of checking each entry's own page separately. The individual entries are also viewable on their own at `/hero.html`, `/stats-strip.html` and `/global-trade-snapshot.html` — useful since the hero's CTA/nav cards and any cross-entry anchors only render once their target selector exists on the page (see above), which isn't the case when viewing an entry in isolation.

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

## Packages

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** — report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* none

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components
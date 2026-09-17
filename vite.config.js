import { createRequire } from 'node:module';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const { name } = require('./package.json');

export default defineConfig(({ command }) => ({
  build: {
    emptyOutDir: true,
    minify: 'terser',
    outDir: 'dist',
    rollupOptions: {
      // index.html is a dev-only combined preview (stacks all 3 entries with stand-in
      // Drupal placeholders, see README's "Local preview" section) — not a build entry,
      // never deployed. Only the 3 real embeddable widgets get bundled for production.
      input: {
        hero: './hero.html',
        'stats-strip': './stats-strip.html',
        'global-trade-snapshot': './global-trade-snapshot.html'
      },
      output: {
        // Entry files keep stable, predictable names (Drupal editors hardcode these in
        // embed snippets and manually bump a `?v=` query param to bust caches on deploy).
        // Shared chunks (e.g. the "styles" chunk holding react/general-tools/meta.json,
        // deduplicated across all 3 entries) must instead get a content hash: each entry's
        // own `import` statement pointing at a shared chunk carries NO query string at all
        // (Rollup emits a bare relative path), so a manual `?v=` bump on the outer <script>
        // tag can never bust a shared chunk's cache — only a genuinely new URL can, which a
        // content hash provides automatically and correctly on every content change.
        entryFileNames: `js/${name}.[name].min.js`,
        chunkFileNames: `js/${name}.[name]-[hash].js`,
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) return `css/${name}_${assetInfo.name.replace('.css', '').replaceAll('-', '_')}.min.css`;
          return `assets/[name][extname]`;
        }
      }
    },
    sourcemap: true,
    terserOptions: {
      compress: {
        drop_console: command === 'build'
      }
    }
  },
  define: {
    __PROJECT_NAME__: JSON.stringify(name)
  },
  plugins: [{ enforce: 'pre', ...mdx() }, react()],
  server: {
    hot: true,
    open: true,
    port: 8080,
    strictPort: false
  }
}));

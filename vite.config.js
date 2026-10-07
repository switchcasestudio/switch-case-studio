import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

// This project MIGRATED from Create React App to Vite + vite-react-ssg
// (2026-06; CRA is gone — react-scripts removed, no CRA config remains).
// One CRA-era convention was kept on purpose: JSX lives inside `.js` files
// (not `.jsx`). The jsInSrcIsJsx plugin (for source) + the optimizeDeps
// moduleTypes entry (for any dep shipping JSX in .js) handle that without
// renaming every component file.

// Since Vite 8 (Rolldown + Oxc) the built-in transform picks its parser from
// the file EXTENSION and has no esbuild-style loader override, so it rejects
// JSX in .js. This plugin compiles the JSX in src/**/*.js itself, with Vite's
// own Oxc, before the built-in transform runs (which then sees plain JS).
const SRC_JS = /\/src\/.*\.js$/;
function jsInSrcIsJsx() {
  let dev = false;
  return {
    name: "scs:js-in-src-is-jsx",
    enforce: "pre",
    configResolved(config) {
      dev = config.command === "serve";
    },
    async transform(code, id) {
      if (!SRC_JS.test(id.split("?")[0])) return null;
      // Fast Refresh only in the dev CLIENT; the SSR render has no refresh
      // runtime ($RefreshSig$ is not defined), same rule as Vite's own Oxc.
      const refresh = dev && this.environment?.config.consumer === "client";
      const out = await transformWithOxc(code, id, {
        lang: "jsx",
        jsx: { runtime: "automatic", development: dev, refresh },
      });
      return { code: out.code, map: out.map };
    },
  };
}

export default defineConfig({
  plugins: [jsInSrcIsJsx(), react({ include: /\.(js|jsx)$/ })],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // "build" (CRA's old dir), NOT Vite's default "dist" — kept deliberately so
    // Netlify's `publish = "build"` and all docs/scripts stay valid.
    outDir: "build",
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Modern Sass API (silences the legacy-js-api deprecation).
        api: "modern",
        // The stylesheets use @import everywhere. Migrating every file to
        // @use/@forward is a large, risk-only-no-benefit refactor, so quiet the
        // @import deprecation instead.
        silenceDeprecations: ["legacy-js-api", "import"],
      },
    },
  },
  ssr: {
    // gsap ships CJS; if left external, the SSG's Node render hits
    // "Named export 'ScrollTrigger' not found" (Node ESM can't named-import
    // CJS). Bundling it through Vite's SSR transform fixes the interop.
    noExternal: ["gsap"],
  },
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: { ".js": "jsx" },
    },
  },
});

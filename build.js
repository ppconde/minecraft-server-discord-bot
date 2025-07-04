import * as esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.ts"], // your main entry file
    bundle: true, // bundle all dependencies
    platform: "node", // target Node.js environment
    target: "node24", // target Node.js v24 syntax
    outfile: "dist/index.js", // output file
    sourcemap: false, // optional: generate source map for debugging
    external: [], // optionally list packages to exclude (e.g. native modules)
    minify: true, // optionally minify output
  })
  .catch(() => process.exit(1));

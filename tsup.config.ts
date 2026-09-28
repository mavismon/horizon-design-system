import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  // Icons are inlined, matching how Vite serves them in Storybook today.
  loader: { ".svg": "dataurl" },
});

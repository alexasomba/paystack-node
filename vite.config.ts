import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["./src/index.ts", "./src/webhooks.ts"],
    format: ["esm"],
    platform: "node",
    dts: { build: true, incremental: false },
    clean: true,
    tsconfig: "./tsconfig.build.json",
    deps: {
      neverBundle: ["openapi-fetch", "yaml"],
    },
  },
});

import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: { ignorePatterns: ["dist/**", "src/openapi-types.ts", "src/operations.ts"] },
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

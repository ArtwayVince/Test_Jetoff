// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import fs from "node:fs";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Sync server-side environment variables from AI Studio runtime if present
for (const envPath of ["/app/.dev.env.json", "../.dev.env.json", "./.dev.env.json"]) {
  try {
    if (fs.existsSync(envPath)) {
      const data = JSON.parse(fs.readFileSync(envPath, "utf-8")) as Record<string, string>;
      if (
        data.GEMINI_API_KEY &&
        (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY")
      ) {
        process.env.GEMINI_API_KEY = data.GEMINI_API_KEY;
      }
      if (
        data.GEMINI_MODEL &&
        (!process.env.GEMINI_MODEL || process.env.GEMINI_MODEL === "MY_GEMINI_MODEL")
      ) {
        process.env.GEMINI_MODEL = data.GEMINI_MODEL;
      }
    }
  } catch {
    // Ignore read errors
  }
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

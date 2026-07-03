// Remotion config — kept separate from Next.js (Remotion has its own webpack
// bundler, so it never touches the `.next/` cache). Run via the `remotion`
// npm scripts. See remotion/README.md.
import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.overrideWebpackConfig((current) => {
  const withTailwind = enableTailwind(current);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ...(withTailwind.resolve?.extensions ?? [])],
      // Mirror the project's `@/` alias (jsconfig.json) so the video can reuse
      // app components like @/components/ui/charts.
      alias: {
        ...(withTailwind.resolve?.alias ?? {}),
        "@": path.resolve(process.cwd()),
      },
    },
  };
});

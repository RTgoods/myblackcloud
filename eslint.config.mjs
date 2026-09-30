import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-dev/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // The game engine — plain JS shipped as-is from BlackCloud (see
      // scripts/sync-game.mjs), not part of this app's TypeScript source.
      "public/game/**",
    ],
  },
];

export default eslintConfig;

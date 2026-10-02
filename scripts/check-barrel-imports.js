#!/usr/bin/env node
/**
 * Enforces barrel/alias imports. Scans files for banned deep or @/ paths
 * that should use short aliases (lib, hooks, utils, types, @/components/ui, etc.).
 * Server-only lib paths (lib/db, lib/auth, etc.) are allowed — see ALLOWED_LIB_PATHS.
 * Usage: node scripts/check-barrel-imports.js [file1 file2 ...]
 * If no files given, lint-staged passes staged files as args; otherwise run with no args to check all.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

/** Allowed lib deep paths for server-only code (avoids pulling postgres/next/headers into edge/client). */
const ALLOWED_LIB_PATHS = [
  "lib/db",
  "lib/auth",
  "lib/auth-edge",
  "lib/auth-utils",
  "lib/auth-workspace",
  "lib/env",
  "lib/logger",
  "lib/public-proposal-auth",
  "lib/proposal-session",
  "lib/post-acceptance",
  "lib/run-proposal-automations",
  "lib/track-email-engagement",
  "lib/automation-flow/engine",
];

const BANNED_PATTERNS = [
  { pattern: /from\s+["'](@\/lib\/[^"']*)["']/, alias: "lib", example: "import { x } from 'lib'", isLib: true },
  { pattern: /from\s+["']@\/hooks\/[^"']*["']/, alias: "hooks", example: "import { x } from 'hooks'" },
  { pattern: /from\s+["']@\/utils\/[^"']*["']/, alias: "utils", example: "import { x } from 'utils'" },
  { pattern: /from\s+["']@\/types\/[^"']*["']/, alias: "types", example: "import type { x } from 'types'" },
  { pattern: /from\s+["']@\/components\/ui\/[^"']*["']/, alias: "@/components/ui", example: "import { Button } from '@/components/ui'" },
  { pattern: /from\s+["']@\/components\/shared\/[^"']*["']/, alias: "shared", example: "import { x } from 'shared'" },
  { pattern: /from\s+["']@\/components\/layouts\/[^"']*["']/, alias: "layouts", example: "import { x } from 'layouts'" },
  { pattern: /from\s+["']@\/components\/sections\/[^"']*["']/, alias: "sections", example: "import { x } from 'sections'" },
  { pattern: /from\s+["']@\/components\/design-system\/variants\/[^"']*["']/, alias: "variants", example: "import { x } from 'variants'" },
  { pattern: /from\s+["'](lib\/[^"']+)["']/, alias: "lib", example: "import { x } from 'lib'", isLib: true },
  { pattern: /from\s+["']hooks\/[^"']+["']/, alias: "hooks", example: "import { x } from 'hooks'" },
  { pattern: /from\s+["']utils\/[^"']+["']/, alias: "utils", example: "import { x } from 'utils'" },
  { pattern: /from\s+["']types\/[^"']+["']/, alias: "types", example: "import type { x } from 'types'" },
  { pattern: /from\s+["']shared\/[^"']+["']/, alias: "shared", example: "import { x } from 'shared'" },
  { pattern: /from\s+["']layouts\/[^"']+["']/, alias: "layouts", example: "import { x } from 'layouts'" },
  { pattern: /from\s+["']sections\/[^"']+["']/, alias: "sections", example: "import { x } from 'sections'" },
  { pattern: /from\s+["']variants\/[^"']+["']/, alias: "variants", example: "import { x } from 'variants'" },
];

function getFilesToCheck() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args.filter((f) => /\.(ts|tsx)$/.test(f) && fs.existsSync(path.resolve(ROOT, f)));
  }
  const glob = require("glob");
  return glob.sync("**/*.{ts,tsx}", {
    cwd: ROOT,
    ignore: ["node_modules/**", ".next/**", "**/*.d.ts", "lib/db/migrations/**", "scripts/**"],
  });
}

function isAllowedLibPath(importPath) {
  const normalized = importPath.replace(/^@\//, "");
  return ALLOWED_LIB_PATHS.some(
    (allowed) => normalized === allowed || normalized.startsWith(allowed + "/")
  );
}

/** Barrel (lib/hooks/etc.) is enforced only for client-side. Server (e.g. API routes) may use deep imports. */
function isServerSideFile(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
  const rel = path.relative(ROOT, fullPath);
  const p = rel.replace(/\\/g, "/");
  return p.startsWith("app/api/");
}

function checkFile(filePath) {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(ROOT, filePath);
  const content = fs.readFileSync(fullPath, "utf8");
  const lines = content.split(/\r?\n/);
  const errors = [];
  const skipBarrelForLib = isServerSideFile(filePath);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const entry of BANNED_PATTERNS) {
      const { pattern, alias, example, isLib } = entry;
      const m = line.match(pattern);
      if (m) {
        if (isLib && m[1] && isAllowedLibPath(m[1])) continue;
        if (isLib && skipBarrelForLib) continue;
        errors.push({
          file: filePath,
          line: i + 1,
          lineContent: line.trim(),
          message: `Use '${alias}' barrel. Example: ${example}`,
        });
      }
    }
  }
  return errors;
}

function main() {
  const files = getFilesToCheck();
  const allErrors = [];
  for (const f of files) {
    allErrors.push(...checkFile(f));
  }
  if (allErrors.length === 0) {
    process.exit(0);
  }
  for (const e of allErrors) {
    console.error(`BLOCKED: ${e.file}:${e.line}`);
    console.error(`  ${e.lineContent}`);
    console.error(`  → ${e.message}`);
  }
  process.exit(1);
}

main();

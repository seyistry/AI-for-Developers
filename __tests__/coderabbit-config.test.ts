/**
 * Unit tests for CodeRabbit configuration.
 *
 * Framework: Jest (TypeScript test file per request).
 * Focus: Validate keys/values present in the PR diff.
 * Notes:
 *  - No new YAML parser dependency is introduced; we use robust text-based checks.
 *  - Tests prefer a local fixture (__tests__/fixtures/.coderabbit.yaml) for determinism,
 *    but can fall back to common repo paths if needed.
 */

import * as fs from 'fs';
import * as path from 'path';

const FIXTURE_PATH = path.resolve(process.cwd(), '__tests__/fixtures/.coderabbit.yaml');

function existingFile(p: string): string | null {
  try {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  } catch { /* ignore */ }
  return null;
}

function findConfigPath(): string {
  // Prefer deterministic local fixture
  const fromFixture = existingFile(FIXTURE_PATH);
  if (fromFixture) return fromFixture;

  // Common filenames in repo root
  const candidates = [
    '.coderabbit.yml',
    '.coderabbit.yaml',
    'coderabbit.yml',
    'coderabbit.yaml',
    'code-rabbit.yml',
    'code-rabbit.yaml',
  ];
  for (const rel of candidates) {
    const p = path.resolve(process.cwd(), rel);
    const ok = existingFile(p);
    if (ok) return ok;
  }

  // Fallback: scan a few conventional locations
  const roots = ['.', './config', './.github', './.config'];
  const exts = ['.yml', '.yaml'];
  for (const root of roots) {
    let entries: string[] = [];
    try { entries = fs.readdirSync(root); } catch { /* ignore */ }
    for (const e of entries) {
      const full = path.join(root, e);
      if (exts.some(ext => e.endsWith(ext)) && existingFile(full)) {
        const txt = fs.readFileSync(full, 'utf8');
        if (/^\s*language:\s*/m.test(txt) &&
            /^\s*reviews:\s*$/m.test(txt) &&
            /^\s*ai_suggestions:\s*$/m.test(txt) &&
            /^\s*security_scanning:\s*$/m.test(txt)) {
          return full;
        }
      }
    }
  }

  throw new Error('CodeRabbit config file not found. Ensure fixture exists at __tests__/fixtures/.coderabbit.yaml');
}

function readConfig(): string {
  const p = findConfigPath();
  return fs.readFileSync(p, 'utf8');
}

/**
 * Extract a nested block by indentation under a given key.
 * Suits the simple shapes in our config.
 */
function extractBlock(yaml: string, key: string): string {
  const lines = yaml.replace(/\r\n/g, '\n').split('\n');
  const idx = lines.findIndex(l => l.trimStart().startsWith(`${key}:`));
  if (idx === -1) return '';
  const indent = (lines[idx].match(/^(\s*)/)?.[1]) ?? '';
  const childIndent = indent + '  '; // assume 2 spaces
  const block: string[] = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { block.push(line); continue; }
    const currentIndent = (line.match(/^(\s*)/)?.[1]) ?? '';
    if (currentIndent.length < childIndent.length) break;
    block.push(line);
  }
  return block.join('\n');
}

/* Helper to escape special regex characters in dynamic pattern to prevent ReDoS */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('CodeRabbit config - top-level validations', () => {
  let yamlText: string;

  beforeAll(() => {
    yamlText = readConfig();
  });

  test('language must be present and set to "en"', () => {
    // allow either language: en or language: "en"
    expect(yamlText).toMatch(/^\s*language:\s*("?en"?)\s*$/m);
  });

  test('reviews section exists with child keys', () => {
    expect(yamlText).toMatch(/^\s*reviews:\s*$/m);
    const reviewsBlock = extractBlock(yamlText, 'reviews');
    expect(reviewsBlock).toMatch(/^\s{2}[A-Za-z_]+:/m);
  });

  test('file is readable and non-empty', () => {
    const p = findConfigPath();
    expect(() => fs.accessSync(p, fs.constants.R_OK)).not.toThrow();
    const txt = fs.readFileSync(p, 'utf8');
    expect(txt.length).toBeGreaterThan(0);
  });
});

describe('reviews.profile', () => {
  let reviewsBlock: string;

  beforeAll(() => {
    reviewsBlock = extractBlock(readConfig(), 'reviews');
  });

  test('profile exists and is "chill" or "assertive"', () => {
    expect(reviewsBlock).toMatch(/^\s{2}profile:\s*"(chill|assertive)"\s*$/m);
  });

  test('profile is "chill" per PR diff', () => {
    expect(reviewsBlock).toMatch(/^\s{2}profile:\s*"chill"\s*$/m);
  });
});

describe('security_scanning flags', () => {
  let secBlock: string;

  beforeAll(() => {
    secBlock = extractBlock(readConfig(), 'security_scanning');
  });

  test('security_scanning block exists under reviews', () => {
    const reviewsBlock = extractBlock(readConfig(), 'reviews');
    expect(reviewsBlock).toMatch(/^\s{2}security_scanning:\s*$/m);
  });

  test('all required flags are explicitly true', () => {
    const requiredFlagsRegex = [
      /^\s{4}enabled:\s*true\s*$/m,
      /^\s{4}scan_dependencies:\s*true\s*$/m,
      /^\s{4}scan_secrets:\s*true\s*$/m,
      /^\s{4}vulnerability_alerts:\s*true\s*$/m,
      /^\s{4}sast_enabled:\s*true\s*$/m,
    ];
    requiredFlagsRegex.forEach(regex => {
      expect(secBlock).toMatch(regex);
    });
  });

  test('no required flags are set to false', () => {
    expect(secBlock).not.toMatch(/^\s{4}(enabled|scan_dependencies|scan_secrets|vulnerability_alerts|sast_enabled):\s*false\s*$/m);
  });
});

describe('ai_suggestions block', () => {
  let aiBlock: string;

  beforeAll(() => {
    aiBlock = extractBlock(readConfig(), 'ai_suggestions');
  });

  test('exists and is enabled', () => {
    expect(aiBlock).toMatch(/^\s{2}enabled:\s*true\s*$/m);
  });

  test('features list contains all required entries exactly once', () => {
    const featuresBlock = extractBlock(aiBlock + '\n', 'features');
    const items = Array.from(featuresBlock.matchAll(/^\s{6}-\s*([a-z_]+)\s*$/gm)).map(m => m[1]);
    const required = [
      'code_optimization',
      'security_best_practices',
      'performance_improvements',
      'accessibility_enhancements',
      'test_coverage',
    ];
    for (const r of required) {
      expect(items).toContain(r);
    }
    const uniq = new Set(items);
    expect(uniq.size).toBe(items.length);
  });

  test('features list items use correct indentation and dash format', () => {
    const featuresBlock = extractBlock(aiBlock + '\n', 'features');
    const invalidIndent = featuresBlock
      .split('\n')
      .some(line => {
        return line.trim().startsWith('-') && !line.startsWith(' '.repeat(6) + '- ');
      });
    expect(invalidIndent).toBe(false);
  });
});

describe('defensive checks', () => {
  test('no merge conflict markers present', () => {
    const txt = readConfig();
    expect(txt).not.toMatch(/^[<=>]{7}/m);
  });
});
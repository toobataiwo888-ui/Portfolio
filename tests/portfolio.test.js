'use strict';

const fs = require('fs');
const path = require('path');
const {
  extractLinks,
  extractSources,
  isLocalReference,
  findWindowsPaths,
  validateStructure,
  findImagesWithoutAlt,
} = require('../src/htmlValidator');

const ROOT = path.join(__dirname, '..');

const HTML_FILES = ['portfolio public.html', 'Fourths Apocalypse.html', 'Fourths Apocalypse2.html'];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

/**
 * Resolve a local reference (which may contain spaces / query strings) to a
 * path relative to the repo root.
 */
function resolveLocal(reference) {
  const clean = reference.split('#')[0].split('?')[0];
  return path.join(ROOT, decodeURIComponent(clean));
}

describe.each(HTML_FILES)('%s', (file) => {
  const html = read(file);

  test('satisfies structural requirements', () => {
    expect(validateStructure(html)).toEqual([]);
  });

  test('contains no absolute Windows filesystem paths', () => {
    const refs = [...extractLinks(html), ...extractSources(html)];
    expect(findWindowsPaths(refs)).toEqual([]);
  });

  test('all images have alt text', () => {
    expect(findImagesWithoutAlt(html)).toEqual([]);
  });
});

describe('internal link integrity', () => {
  // Targets that are intentionally not yet in the repo (future project pages).
  const KNOWN_MISSING = new Set([
    'project3.html',
    'project4.html',
    'project5.html',
    'project6.html',
  ]);

  test.each(HTML_FILES)('%s local links resolve to existing files', (file) => {
    const html = read(file);
    const brokenLinks = extractLinks(html)
      .filter(isLocalReference)
      .filter((ref) => !KNOWN_MISSING.has(ref))
      .filter((ref) => !fs.existsSync(resolveLocal(ref)));
    expect(brokenLinks).toEqual([]);
  });
});

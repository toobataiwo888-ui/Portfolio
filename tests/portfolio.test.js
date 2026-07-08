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

// Assets referenced by the pages that are intentionally not yet committed.
const KNOWN_MISSING = new Set([
  // Future project pages linked from the homepage footer.
  'project3.html',
  'project4.html',
  'project5.html',
  'project6.html',
  // Gallery images for Fourths Apocalypse2.html (not yet added to the repo).
  'Images/4_20251108_115135_0001.png',
  'Images/6_20251108_115135_0003.png',
  'Images/7_20251108_115135_0004.png',
  'Images/8_20251108_115135_0005.png',
  'Images/9_20251108_115136_0006.png',
  'Images/10_20251108_115136_0007.png',
  'Images/11_20251108_115136_0008.png',
  'Images/12_20251108_115136_0009.png',
]);

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

describe('internal reference integrity', () => {
  const unresolved = (references) =>
    references
      .filter(isLocalReference)
      .filter((ref) => !KNOWN_MISSING.has(ref))
      .filter((ref) => !fs.existsSync(resolveLocal(ref)));

  test.each(HTML_FILES)('%s local links resolve to existing files', (file) => {
    expect(unresolved(extractLinks(read(file)))).toEqual([]);
  });

  test.each(HTML_FILES)('%s local image sources resolve to existing files', (file) => {
    expect(unresolved(extractSources(read(file)))).toEqual([]);
  });
});

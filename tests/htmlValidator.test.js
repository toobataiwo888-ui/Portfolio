'use strict';

const {
  extractLinks,
  extractSources,
  isWindowsPath,
  isExternalLink,
  isLocalReference,
  findWindowsPaths,
  validateStructure,
  findImagesWithoutAlt,
} = require('../src/htmlValidator');

describe('extractLinks', () => {
  test('returns all href values', () => {
    const html = '<a href="a.html">A</a><a href=\'b.html\'>B</a>';
    expect(extractLinks(html)).toEqual(['a.html', 'b.html']);
  });

  test('trims surrounding whitespace', () => {
    expect(extractLinks('<a href="  c.html  ">C</a>')).toEqual(['c.html']);
  });

  test('returns empty array when no links', () => {
    expect(extractLinks('<p>no links here</p>')).toEqual([]);
  });

  test('throws on non-string input', () => {
    expect(() => extractLinks(null)).toThrow(TypeError);
  });
});

describe('extractSources', () => {
  test('returns all src values', () => {
    const html = '<img src="x.png"><img src=\'y.png\'>';
    expect(extractSources(html)).toEqual(['x.png', 'y.png']);
  });

  test('returns empty array when no sources', () => {
    expect(extractSources('<p>nothing</p>')).toEqual([]);
  });

  test('throws on non-string input', () => {
    expect(() => extractSources(42)).toThrow(TypeError);
  });
});

describe('isWindowsPath', () => {
  test('detects backslash windows paths', () => {
    expect(isWindowsPath('C:\\Users\\HomePC\\file.html')).toBe(true);
  });

  test('detects forward-slash drive paths', () => {
    expect(isWindowsPath('D:/data/file.png')).toBe(true);
  });

  test('is false for relative references', () => {
    expect(isWindowsPath('title-card.png')).toBe(false);
  });

  test('is false for urls', () => {
    expect(isWindowsPath('https://example.com')).toBe(false);
  });

  test('is false for non-string', () => {
    expect(isWindowsPath(undefined)).toBe(false);
  });
});

describe('isExternalLink', () => {
  test.each([
    ['https://example.com', true],
    ['http://example.com', true],
    ['mailto:me@example.com', true],
    ['tel:+123456789', true],
    ['#section', true],
    ['data:image/png;base64,AAAA', true],
    ['page.html', false],
    ['images/a.png', false],
  ])('%s -> %s', (input, expected) => {
    expect(isExternalLink(input)).toBe(expected);
  });

  test('is false for non-string', () => {
    expect(isExternalLink(null)).toBe(false);
  });
});

describe('isLocalReference', () => {
  test('true for relative file', () => {
    expect(isLocalReference('page.html')).toBe(true);
  });

  test('false for external', () => {
    expect(isLocalReference('https://example.com')).toBe(false);
  });

  test('false for windows path', () => {
    expect(isLocalReference('C:\\file.html')).toBe(false);
  });

  test('false for empty string', () => {
    expect(isLocalReference('   ')).toBe(false);
  });
});

describe('findWindowsPaths', () => {
  test('returns only windows paths', () => {
    const refs = ['a.html', 'C:\\x.html', 'https://y.com', 'D:/z.png'];
    expect(findWindowsPaths(refs)).toEqual(['C:\\x.html', 'D:/z.png']);
  });

  test('returns empty array when none', () => {
    expect(findWindowsPaths(['a.html', 'b.png'])).toEqual([]);
  });

  test('throws on non-array', () => {
    expect(() => findWindowsPaths('nope')).toThrow(TypeError);
  });
});

describe('validateStructure', () => {
  const valid = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello</title>
    </head>
    <body></body>
    </html>`;

  test('returns no problems for a valid document', () => {
    expect(validateStructure(valid)).toEqual([]);
  });

  test('flags missing doctype', () => {
    expect(validateStructure('<html lang="en"></html>')).toContain(
      'missing <!DOCTYPE html> declaration'
    );
  });

  test('flags missing lang', () => {
    expect(validateStructure('<!DOCTYPE html><html></html>')).toContain(
      'missing lang attribute on <html>'
    );
  });

  test('flags missing charset', () => {
    const problems = validateStructure('<!DOCTYPE html><html lang="en"></html>');
    expect(problems).toContain('missing charset <meta> tag');
  });

  test('flags missing viewport', () => {
    const problems = validateStructure('<!DOCTYPE html><html lang="en"></html>');
    expect(problems).toContain('missing viewport <meta> tag');
  });

  test('flags empty title', () => {
    const html = '<!DOCTYPE html><html lang="en"><title></title></html>';
    expect(validateStructure(html)).toContain('missing or empty <title>');
  });

  test('throws on non-string input', () => {
    expect(() => validateStructure(123)).toThrow(TypeError);
  });
});

describe('findImagesWithoutAlt', () => {
  test('flags images without alt', () => {
    const html = '<img src="a.png"><img src="b.png" alt="ok">';
    expect(findImagesWithoutAlt(html)).toEqual(['<img src="a.png">']);
  });

  test('flags images with empty alt', () => {
    const html = '<img src="a.png" alt="">';
    expect(findImagesWithoutAlt(html)).toHaveLength(1);
  });

  test('returns empty array when all have alt', () => {
    const html = '<img src="a.png" alt="A"><img src="b.png" alt="B">';
    expect(findImagesWithoutAlt(html)).toEqual([]);
  });

  test('throws on non-string input', () => {
    expect(() => findImagesWithoutAlt({})).toThrow(TypeError);
  });
});

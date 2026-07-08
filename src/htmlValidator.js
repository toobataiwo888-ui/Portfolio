'use strict';

/**
 * Utilities for validating the static HTML pages in this portfolio.
 *
 * The functions here are intentionally dependency-free and operate on plain
 * strings so they can be unit tested in isolation, and also composed together
 * to validate the real files on disk.
 */

const WINDOWS_PATH_REGEX = /^[a-zA-Z]:[\\/]/;
const EXTERNAL_LINK_REGEX = /^(https?:|mailto:|tel:|#|data:)/i;

/**
 * Extract the values of every href attribute in an HTML string.
 * @param {string} html
 * @returns {string[]}
 */
function extractLinks(html) {
  if (typeof html !== 'string') {
    throw new TypeError('html must be a string');
  }
  const links = [];
  const regex = /href\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push(match[2].trim());
  }
  return links;
}

/**
 * Extract the values of every src attribute in an HTML string.
 * @param {string} html
 * @returns {string[]}
 */
function extractSources(html) {
  if (typeof html !== 'string') {
    throw new TypeError('html must be a string');
  }
  const sources = [];
  const regex = /src\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    sources.push(match[2].trim());
  }
  return sources;
}

/**
 * Determine whether a reference points to an absolute Windows filesystem path
 * (e.g. "C:\\Users\\..."), which never works when the site is served.
 * @param {string} reference
 * @returns {boolean}
 */
function isWindowsPath(reference) {
  if (typeof reference !== 'string') {
    return false;
  }
  return WINDOWS_PATH_REGEX.test(reference);
}

/**
 * Determine whether a reference is external (http, mailto, tel, anchor, data).
 * @param {string} reference
 * @returns {boolean}
 */
function isExternalLink(reference) {
  if (typeof reference !== 'string') {
    return false;
  }
  return EXTERNAL_LINK_REGEX.test(reference.trim());
}

/**
 * Determine whether a reference is a local relative file reference (i.e. not
 * external and not a Windows absolute path).
 * @param {string} reference
 * @returns {boolean}
 */
function isLocalReference(reference) {
  if (typeof reference !== 'string' || reference.trim() === '') {
    return false;
  }
  return !isExternalLink(reference) && !isWindowsPath(reference);
}

/**
 * Return every reference (from the provided list) that is an absolute Windows
 * filesystem path.
 * @param {string[]} references
 * @returns {string[]}
 */
function findWindowsPaths(references) {
  if (!Array.isArray(references)) {
    throw new TypeError('references must be an array');
  }
  return references.filter(isWindowsPath);
}

/**
 * Validate the structural requirements of an HTML document.
 * @param {string} html
 * @returns {string[]} array of human readable problems (empty when valid)
 */
function validateStructure(html) {
  if (typeof html !== 'string') {
    throw new TypeError('html must be a string');
  }
  const problems = [];
  if (!/<!DOCTYPE html>/i.test(html)) {
    problems.push('missing <!DOCTYPE html> declaration');
  }
  if (!/<html[^>]*\slang\s*=/i.test(html)) {
    problems.push('missing lang attribute on <html>');
  }
  if (!/<meta[^>]*charset/i.test(html)) {
    problems.push('missing charset <meta> tag');
  }
  if (!/<meta[^>]*name\s*=\s*(["'])viewport\1/i.test(html)) {
    problems.push('missing viewport <meta> tag');
  }
  if (!/<title>\s*\S[\s\S]*?<\/title>/i.test(html)) {
    problems.push('missing or empty <title>');
  }
  return problems;
}

/**
 * Ensure every <img> has a non-empty alt attribute.
 * @param {string} html
 * @returns {string[]} array of img tags that are missing alt text
 */
function findImagesWithoutAlt(html) {
  if (typeof html !== 'string') {
    throw new TypeError('html must be a string');
  }
  const missing = [];
  const imgRegex = /<img\b[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const altMatch = /alt\s*=\s*(["'])(.*?)\1/i.exec(tag);
    if (!altMatch || altMatch[2].trim() === '') {
      missing.push(tag);
    }
  }
  return missing;
}

module.exports = {
  extractLinks,
  extractSources,
  isWindowsPath,
  isExternalLink,
  isLocalReference,
  findWindowsPaths,
  validateStructure,
  findImagesWithoutAlt,
};

/**
 * Render a plain-text paragraph that may contain `[label](/internal/path/)`
 * links into safe HTML. Everything is HTML-escaped first; only root-relative
 * hrefs are turned into anchors, so authored copy cannot inject markup.
 */
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export function renderInline(text: string): string {
  return escapeHtml(text).replace(
    LINK,
    (_m, label: string, href: string) => `<a href="${href}">${label}</a>`
  );
}

/** Strip link markup, leaving the label — for schema text and meta tags. */
export function stripInline(text: string): string {
  return text.replace(LINK, "$1");
}

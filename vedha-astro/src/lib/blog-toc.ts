/**
 * Jump-link / TOC helpers for blog posts.
 * Authors can add a short jump-link list before the first ##:
 *
 *   **On this page:**
 *   - [Short label](#section-id)
 *
 * That list drives "In this article" and is stripped from the published body.
 */

export type JumpLink = { text: string; id?: string };

export function slugifyHeading(text: string, used: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section";
  const count = (used.get(base) ?? 0) + 1;
  used.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
}

/** Normalize frontmatter `toc` into jump links (label only, or {text,id}). */
export function normalizeFrontmatterToc(raw: unknown): JumpLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return { text: item.trim() };
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const text = String(o.label ?? o.text ?? "").trim();
        let id = o.id != null ? String(o.id).replace(/^#/, "").trim() : undefined;
        if (!id && o.href != null) id = String(o.href).replace(/^#/, "").trim();
        return { text, id: id || undefined };
      }
      return { text: "" };
    })
    .filter((l) => l.text.length > 0);
}

function parseLinkListBlock(block: string): JumpLink[] {
  return [...block.matchAll(/[-*+]\s*\[([^\]]+)\]\(#([^)]+)\)/g)].map((x) => ({
    text: x[1].trim(),
    id: x[2].trim(),
  }));
}

/**
 * Pull jump-link list(s) from markdown (anywhere before the first ##).
 * Every in-page jump list is removed from the body so the auto TOC is never duplicated.
 * When multiple lists exist, the last one supplies the nav labels (refined author labels).
 */
export function extractJumpLinks(markdown: string): {
  content: string;
  links: JumpLink[];
} {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const firstH2 = normalized.search(/^##\s/m);
  const head = firstH2 === -1 ? normalized : normalized.slice(0, firstH2);
  const tail = firstH2 === -1 ? "" : normalized.slice(firstH2);

  // Contiguous blocks of 2+ in-page jump links before the first H2
  const listRe = /(?:^[ \t]*[-*+]\s*\[[^\]]+\]\(#[^)]+\)[ \t]*\n?){2,}/gm;
  const blocks: { start: number; end: number; links: JumpLink[] }[] = [];
  let m: RegExpExecArray | null;
  while ((m = listRe.exec(head)) !== null) {
    const links = parseLinkListBlock(m[0]);
    if (links.length < 2) continue;
    blocks.push({ start: m.index, end: m.index + m[0].length, links });
  }

  if (blocks.length === 0) return { content: markdown, links: [] };

  // Last list wins for labels (authors often replace a full H2 list with shorter labels).
  const preferred = blocks[blocks.length - 1].links;

  // Drop only an immediate kicker line above each list (not blank lines that belong
  // to a prior list — expanding those caused overlaps and left a second list behind).
  const removeRanges = blocks.map((block) => {
    let start = block.start;
    const before = head.slice(0, start);
    const kicker = before.match(
      /((?:\*\*[^*\n]+?\*\*|On this page:?|In this article:?)[ \t]*\n+)$/i
    );
    if (kicker) start = before.length - kicker[0].length;

    let end = block.end;
    while (head[end] === "\n") end++;
    return { start, end };
  });

  removeRanges.sort((a, b) => a.start - b.start);
  let nextHead = "";
  let cursor = 0;
  for (const range of removeRanges) {
    if (range.end <= cursor) continue;
    const from = Math.max(range.start, cursor);
    nextHead += head.slice(cursor, from);
    cursor = range.end;
  }
  nextHead += head.slice(cursor);

  const content = (nextHead.replace(/^\n+/, "").replace(/\n+$/, "\n\n") + tail).replace(
    /^\s+/,
    ""
  );
  return { content, links: preferred };
}

/**
 * True when a UL/OL is only in-page jump links (no other list content).
 */
function isPureJumpListHtml(listHtml: string): boolean {
  const items = [...listHtml.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi)];
  if (items.length < 2) return false;
  return items.every((item) => {
    const inner = item[1].trim();
    return /^<a\s+[^>]*href\s*=\s*["']#[^"']+["'][^>]*>[\s\S]*?<\/a>$/i.test(inner);
  });
}

/**
 * Safety net: strip pure in-page jump lists from HTML before the first H2
 * so the body never doubles the "In this article" nav (even if markdown extract misses one).
 */
export function stripLeadingJumpNavHtml(html: string): string {
  const firstH2 = html.search(/<h2[\s>]/i);
  const head = firstH2 === -1 ? html : html.slice(0, firstH2);
  const rest = firstH2 === -1 ? "" : html.slice(firstH2);

  const cleanedHead = head.replace(
    /<(ul|ol)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi,
    (match) => (isPureJumpListHtml(match) ? "" : match)
  );

  return (cleanedHead + rest).replace(/^\s+/, "").replace(/(<\/p>)\s{2,}/gi, "$1\n");
}

/** Add h2 ids and build TOC; prefer short jump-link labels when provided. */
export function withHeadingAnchors(
  html: string,
  jumpLinks: JumpLink[] = []
): { html: string; toc: JumpLink[] } {
  const used = new Map<string, number>();
  let index = 0;
  const toc: JumpLink[] = [];

  const next = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_m, attrs = "", inner) => {
    const plain = String(inner)
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    if (!plain) return `<h2${attrs || ""}>${inner}</h2>`;

    const custom = jumpLinks[index++];
    let id: string;
    if (custom?.id) {
      const base = custom.id;
      const count = (used.get(base) ?? 0) + 1;
      used.set(base, count);
      id = count === 1 ? base : `${base}-${count}`;
    } else {
      id = slugifyHeading(plain, used);
    }

    if (jumpLinks.length > 0) {
      if (custom) toc.push({ id, text: custom.text });
    } else {
      toc.push({ id, text: plain });
    }

    const cleanAttrs = String(attrs || "").replace(/\s*id=(["']).*?\1/i, "");
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });

  return { html: next, toc };
}

/** Wrap tables so wide comparisons can scroll on mobile without squashing cells. */
export function wrapTables(html: string): string {
  return html.replace(/<table[\s\S]*?<\/table>/gi, (table) =>
    `<div class="post__table-wrap" role="region" aria-label="Scrollable comparison table" tabindex="0">${table}</div>`
  );
}

/**
 * Slug + secret-token generation for invitations.
 *
 * For now these are produced on the client so the wizard works without a
 * backend. When the friend's Python service is live, slug uniqueness and token
 * issuing move server-side — the shapes stay the same.
 */

// Kazakh + Russian Cyrillic → Latin, enough for readable slugs.
const TRANSLIT: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "i", і: "i", к: "k", қ: "q", л: "l", м: "m",
  н: "n", ң: "n", о: "o", ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ұ: "u", ү: "u", ф: "f", х: "h", һ: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("");
}

function randomBase36(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

/** Readable slug from host names plus a short random suffix for uniqueness. */
export function makeSlug(names: string[]): string {
  const base = transliterate(names.join(" "))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = randomBase36(4);
  return base ? `${base}-${suffix}` : `toi-${suffix}`;
}

/** Hard-to-guess token that gates the manage page. */
export function makeEditToken(): string {
  return randomBase36(24);
}

/** Short human-friendly order code the payer adds to the Kaspi comment. */
export function makeOrderRef(): string {
  return randomBase36(6).toUpperCase();
}

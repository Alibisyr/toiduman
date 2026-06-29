/**
 * Date formatting for invitations.
 *
 * We format month names manually because `Intl` Kazakh ("kk") data is
 * inconsistent across environments (it can fall back to "M08"-style months).
 * Controlling the names guarantees correct output for our two locales.
 */
const MONTHS: Record<string, string[]> = {
  kk: [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
};

/** Month name for a given locale + 0-based index, e.g. monthName("kk", 8) → "қыркүйек". */
export function monthName(locale: string, monthIndex: number): string {
  const months = MONTHS[locale] ?? MONTHS.ru;
  return months[monthIndex] ?? "";
}

/** e.g. "15 тамыз 2026 ж., 18:00" (kk) / "15 августа 2026, 18:00" (ru). */
export function formatEventDateTime(value: string, locale: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const months = MONTHS[locale] ?? MONTHS.ru;
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const yearSuffix = locale === "kk" ? " ж." : "";

  return `${day} ${month} ${year}${yearSuffix}, ${hh}:${mm}`;
}

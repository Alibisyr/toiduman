/**
 * Minimal calendar helpers for the invitation's date section.
 * Monday-first weeks (KZ/RU convention).
 */

/** Short weekday headers, Monday → Sunday. */
export const WEEKDAYS_SHORT: Record<string, string[]> = {
  kk: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};

/**
 * Returns the month laid out as weeks of day numbers (1..N), with `null` for
 * leading/trailing blanks. Weeks start on Monday.
 */
export function buildMonthMatrix(
  year: number,
  monthIndex: number,
): (number | null)[][] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // JS getDay(): 0=Sun..6=Sat → shift so Monday=0.
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

import type { ToiType } from "./toi-schema";

/** Display metadata for each toi type: emoji + the `Types` message key. */
export const TOI_TYPE_META: Record<ToiType, { emoji: string; labelKey: string }> = {
  wedding: { emoji: "💍", labelKey: "wedding" },
  kyz_uzatu: { emoji: "🌸", labelKey: "kyzUzatu" },
  kudalyk: { emoji: "🤝", labelKey: "kudalyk" },
  betashar: { emoji: "🤍", labelKey: "betashar" },
  shildehana: { emoji: "👶", labelKey: "shildehana" },
  besik_toi: { emoji: "🍼", labelKey: "besikToi" },
  tusau_kesu: { emoji: "👣", labelKey: "tusauKesu" },
  sundet: { emoji: "🎉", labelKey: "sundet" },
  mushel: { emoji: "🌙", labelKey: "mushel" },
  birthday: { emoji: "🎂", labelKey: "birthday" },
  anniversary: { emoji: "🎊", labelKey: "anniversary" },
  other: { emoji: "✨", labelKey: "other" },
};

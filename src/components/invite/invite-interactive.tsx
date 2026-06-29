"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Heart, Send } from "lucide-react";

/**
 * Guest-facing RSVP. Local-only for now: it confirms in the UI and stops.
 * Styled with the scoped `.tpl-*` theme classes so it adapts to any template.
 *
 * TODO(backend): POST to the friend's Python/Supabase endpoint keyed by the
 * invite slug so hosts see responses. No accounts — identify by slug + name.
 */
export function Rsvp() {
  const t = useTranslations("Invite");
  const options = [
    { id: "yes", label: t("rsvpYes") },
    { id: "couple", label: t("rsvpCouple") },
    { id: "no", label: t("rsvpNo") },
  ] as const;

  const [choice, setChoice] = useState<string>("yes");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="tpl-card rounded-2xl px-6 py-8 text-center">
        <CheckCircle2 className="tpl-gold mx-auto h-9 w-9" />
        <p className="tpl-ink mt-3 font-display text-lg font-semibold">
          {t("rsvpThanks")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-3"
    >
      {options.map((o) => {
        const active = choice === o.id;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => setChoice(o.id)}
            className="tpl-card flex w-full items-center gap-3 rounded-full px-5 py-3.5 text-left text-sm transition-all"
            style={
              active
                ? { borderColor: "var(--tpr)", boxShadow: "0 4px 14px -8px rgba(0,0,0,0.35)" }
                : undefined
            }
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2"
              style={{ borderColor: active ? "var(--tpr)" : "var(--tl)" }}
            >
              {active ? (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: "var(--tpr)" }}
                />
              ) : null}
            </span>
            <span className={active ? "tpl-ink font-medium" : "tpl-soft"}>
              {o.label}
            </span>
          </button>
        );
      })}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("rsvpNamePh")}
        className="tpl-input h-12 w-full rounded-full px-5 text-sm focus:outline-none"
      />

      <button
        type="submit"
        className="tpl-btn h-12 w-full rounded-full text-sm font-medium transition-all hover:-translate-y-px"
      >
        {t("rsvpSubmit")}
      </button>
    </form>
  );
}

type Wish = { name: string; text: string; likes: number };

/**
 * Guest wish wall. Local-only for now (appends in memory).
 *
 * TODO(backend): persist wishes per invite slug and stream them in.
 */
export function WishWall() {
  const t = useTranslations("Invite");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;
    setWishes((w) => [{ name: name.trim(), text: text.trim(), likes: 0 }, ...w]);
    setName("");
    setText("");
  }

  return (
    <div>
      {wishes.length === 0 ? (
        <p className="tpl-soft mb-5 text-center text-sm">{t("wishesEmpty")}</p>
      ) : (
        <ul className="mb-6 space-y-3">
          {wishes.map((w, i) => (
            <li key={i} className="tpl-card rounded-2xl px-5 py-4 text-left">
              <p className="tpl-ink text-sm leading-6">{w.text}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-xs font-semibold"
                    style={{
                      background: "color-mix(in srgb, var(--tpr) 14%, transparent)",
                      color: "var(--tpr)",
                    }}
                  >
                    {w.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="tpl-ink text-sm font-medium">{w.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setWishes((all) =>
                      all.map((x, j) =>
                        j === i ? { ...x, likes: x.likes + 1 } : x,
                      ),
                    )
                  }
                  className="tpl-soft flex items-center gap-1 text-xs transition-colors hover:opacity-70"
                >
                  <Heart className="h-3.5 w-3.5" /> {w.likes}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("rsvpNamePh")}
          className="tpl-input h-12 w-full rounded-full px-5 text-sm focus:outline-none"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("wishPh")}
          rows={3}
          className="tpl-input w-full rounded-2xl px-5 py-3 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="tpl-btn-outline flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium transition-all hover:-translate-y-px"
        >
          <Send className="h-4 w-4" />
          {t("leaveWish")}
        </button>
      </form>
    </div>
  );
}

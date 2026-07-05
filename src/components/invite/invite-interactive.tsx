"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Heart,
  Minus,
  Pause,
  Play,
  Plus,
  Send,
  UserPlus,
} from "lucide-react";

/**
 * Hero music player. Browsers block autoplay of sound, so this is an explicit
 * tap-to-play control. A spinning gold ring signals it is playing. Renders
 * nothing without a `src`. Styled through the scoped `.tpl-*` variables.
 */
export function MusicToggle({ src }: { src: string }) {
  const t = useTranslations("Invite");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Pause + reset if the source ever changes or the component unmounts.
    return () => {
      audioRef.current?.pause();
    };
  }, [src]);

  if (!src) return null;

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("musicPause") : t("musicPlay")}
        aria-pressed={playing}
        className="relative grid h-12 w-12 place-items-center rounded-full transition-transform hover:-translate-y-px active:translate-y-0"
        style={{
          background: "var(--tpr)",
          color: "var(--top)",
          boxShadow: "0 6px 18px -8px rgba(0,0,0,0.55)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full border"
          style={{
            borderColor: "var(--g2)",
            borderTopColor: "transparent",
            opacity: playing ? 1 : 0.5,
            animation: playing ? "inv-spin 2.6s linear infinite" : "none",
          }}
        />
        {playing ? (
          <Pause className="h-4 w-4" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
        )}
      </button>
      <span
        className="text-[0.7rem] font-medium uppercase tracking-[0.25em]"
        style={{ color: "var(--g2)" }}
      >
        {t("music")}
      </span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} loop preload="none" />
    </span>
  );
}

/**
 * Guest-facing RSVP: attendance (Yes / No), guest name, and — when attending —
 * a companion (+1) toggle with a guest count. Local-only for now: it confirms
 * in the UI and stops. Styled with the scoped `.tpl-*` theme classes.
 *
 * TODO(backend): POST to the friend's Python/Supabase endpoint keyed by the
 * invite slug so hosts see responses. No accounts — identify by slug + name.
 */
export function Rsvp() {
  const t = useTranslations("Invite");

  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [withCompanion, setWithCompanion] = useState(false);
  const [guests, setGuests] = useState(2); // self + 1, when bringing a companion
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

  const yes = attending === "yes";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!attending) return;
        setSent(true);
      }}
      className="space-y-4"
    >
      <p className="tpl-soft text-center text-xs font-medium uppercase tracking-[0.2em]">
        {t("rsvpAttendQ")}
      </p>

      {/* Attendance — Yes / No */}
      <div className="grid grid-cols-2 gap-3">
        {(["yes", "no"] as const).map((id) => {
          const active = attending === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => setAttending(id)}
              aria-pressed={active}
              className="tpl-card rounded-2xl px-4 py-3.5 text-center text-sm font-medium transition-all"
              style={
                active
                  ? {
                      borderColor: id === "yes" ? "var(--tpr)" : "var(--tac)",
                      background:
                        id === "yes"
                          ? "color-mix(in srgb, var(--tpr) 12%, var(--tp))"
                          : "color-mix(in srgb, var(--tac) 12%, var(--tp))",
                      boxShadow: "0 6px 16px -10px rgba(0,0,0,0.4)",
                    }
                  : undefined
              }
            >
              <span className={active ? "tpl-ink" : "tpl-soft"}>
                {id === "yes" ? t("rsvpYes") : t("rsvpNo")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("rsvpName")}
        className="tpl-input h-12 w-full rounded-full px-5 text-sm focus:outline-none"
      />

      {/* Companion status — only meaningful when attending */}
      {yes ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setWithCompanion((v) => !v);
              setGuests((g) => (withCompanion ? 1 : Math.max(2, g)));
            }}
            aria-pressed={withCompanion}
            className="tpl-card flex w-full items-center gap-3 rounded-full px-5 py-3.5 text-left text-sm transition-all"
            style={
              withCompanion
                ? { borderColor: "var(--tpr)" }
                : undefined
            }
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2"
              style={{ borderColor: withCompanion ? "var(--tpr)" : "var(--tl)" }}
            >
              {withCompanion ? (
                <span
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: "var(--tpr)" }}
                />
              ) : null}
            </span>
            <UserPlus className="tpl-gold h-4 w-4 shrink-0" />
            <span className={withCompanion ? "tpl-ink font-medium" : "tpl-soft"}>
              {t("rsvpPlusOne")}
            </span>
          </button>

          {withCompanion ? (
            <div className="tpl-card flex items-center justify-between rounded-full px-5 py-2.5">
              <span className="tpl-soft text-xs font-medium uppercase tracking-wide">
                {t("rsvpGuests")}
              </span>
              <span className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="−"
                  onClick={() => setGuests((g) => Math.max(2, g - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border tpl-line tpl-soft transition-colors hover:opacity-70"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="tpl-ink w-5 text-center font-display text-lg font-bold">
                  {guests}
                </span>
                <button
                  type="button"
                  aria-label="+"
                  onClick={() => setGuests((g) => Math.min(9, g + 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border tpl-line tpl-soft transition-colors hover:opacity-70"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!attending}
        className="tpl-btn h-12 w-full rounded-full text-sm font-medium transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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

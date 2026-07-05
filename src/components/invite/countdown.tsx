"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Live countdown to the toi (days / hours / minutes). Hidden once past. */
export function Countdown({ eventAt }: { eventAt: string }) {
  const t = useTranslations("Invite");
  const target = eventAt ? new Date(eventAt).getTime() : NaN;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!eventAt || Number.isNaN(target) || target <= now) return null;

  const totalMin = Math.floor((target - now) / 60_000);
  const blocks = [
    { value: Math.floor(totalMin / (60 * 24)), label: t("cd_days") },
    { value: Math.floor((totalMin % (60 * 24)) / 60), label: t("cd_hours") },
    { value: totalMin % 60, label: t("cd_min") },
  ];

  return (
    <div className="mt-6">
      <p className="tpl-soft font-serif text-xs uppercase tracking-[0.22em]">
        {t("untilToi")}
      </p>
      <div className="mt-3 flex items-stretch justify-center gap-2.5">
        {blocks.map((b) => (
          <div key={b.label} className="tpl-card min-w-16 rounded-xl px-3 py-2.5">
            <div className="tpl-gold font-serif text-2xl font-semibold tabular-nums">
              {b.value}
            </div>
            <div className="tpl-soft text-[10px] uppercase tracking-[0.14em]">
              {b.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

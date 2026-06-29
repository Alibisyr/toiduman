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
    <div className="mt-5">
      <p className="tpl-soft text-xs uppercase tracking-wide">{t("untilToi")}</p>
      <div className="mt-2 flex items-stretch justify-center gap-2">
        {blocks.map((b) => (
          <div key={b.label} className="tpl-card min-w-14 rounded-lg px-3 py-2">
            <div className="tpl-gold font-display text-xl font-bold">
              {b.value}
            </div>
            <div className="tpl-soft text-[10px] uppercase">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

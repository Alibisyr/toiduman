import type { ToiData } from "@/lib/toi-schema";

/**
 * Sample invitation data for showcasing templates (the gallery thumbnails and
 * the `/preview` route). Not real user data — purely illustrative.
 */
export function getDemoToi(locale: string): ToiData {
  const kk = locale === "kk";
  return {
    title: kk ? "Үйлену тойы" : "Свадьба",
    hostNames: ["Айдана", "Нұрлан"],
    eventAt: "2026-09-14T15:30:00",
    venueName: kk ? "Той мекені «Алтын Орда»" : "Той-холл «Алтын Орда»",
    address: kk ? "Алматы, Достық даңғылы, 240" : "Алматы, пр. Достык, 240",
    mapUrl: "https://2gis.kz/almaty",
    dressCode: kk ? "Классикалық стиль" : "Классический стиль",
    program: [
      { time: "16:00", title: kk ? "Қонақтарды қарсы алу" : "Встреча гостей" },
      { time: "17:00", title: kk ? "Салтанатты ас" : "Торжество" },
      { time: "21:00", title: kk ? "Той-думан" : "Танцевальный вечер" },
    ],
    contacts: [
      { name: kk ? "Той иесі" : "Организатор", phone: "+7 700 123 45 67" },
    ],
    coverPhotoUrl: "",
    gallery: [],
    customMessage: kk
      ? "Сіздерді ұлымыз Нұрлан мен қызымыз Айдананың үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз."
      : "Приглашаем вас стать почётным гостем на торжестве в честь свадьбы наших детей — Нурлана и Айданы.",
  };
}

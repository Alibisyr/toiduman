import type { ToiData } from "./toi-schema";

/**
 * Device-local record of invitations created on this browser. Lets a user
 * return to "My invitations" without an account. The secret `editToken` in the
 * manage URL remains the real source of truth.
 */
export type SavedToi = {
  id: string;
  slug: string;
  editToken: string;
  title: string;
  type: string;
  templateId: string;
  createdAt: string;
  data: ToiData;
};

const KEY = "toiduman-mytois";

export function listTois(): SavedToi[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SavedToi[];
  } catch {
    return [];
  }
}

export function saveToi(toi: SavedToi): void {
  if (typeof window === "undefined") return;
  const others = listTois().filter((t) => t.id !== toi.id);
  localStorage.setItem(KEY, JSON.stringify([toi, ...others]));
}

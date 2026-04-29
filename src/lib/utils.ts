import type { ListStats, ShoppingItem } from "./types";

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getListStats(items: ShoppingItem[]): ListStats {
  const purchased = items.filter((item) => item.purchased).length;
  return {
    total: items.length,
    purchased,
    pending: items.length - purchased,
  };
}

export function getCompletionPercent(items: ShoppingItem[]) {
  if (items.length === 0) {
    return 0;
  }

  return Math.round((items.filter((item) => item.purchased).length / items.length) * 100);
}

export function sortItems(items: ShoppingItem[]) {
  return [...items].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }

    return a.created_at.localeCompare(b.created_at);
  });
}

export function getSupabaseMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return fallback;
}

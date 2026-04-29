"use client";

import { Copy, ExternalLink, Trash2 } from "lucide-react";
import type { ListStats, ShoppingList } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

type ListCardProps = {
  list: ShoppingList;
  stats: ListStats;
  busy?: boolean;
  onOpen: (listId: string) => void;
  onDuplicate: (list: ShoppingList) => void;
  onDelete: (list: ShoppingList) => void;
};

export function ListCard({ list, stats, busy, onOpen, onDuplicate, onDelete }: ListCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-950">{list.name}</h2>
          <p className="mt-1 text-xs text-slate-500">Atualizada em {formatDateTime(list.updated_at)}</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {stats.pending} pend.
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-lg font-bold text-slate-950">{stats.total}</p>
          <p className="text-xs text-slate-500">itens</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-lg font-bold text-slate-950">{stats.purchased}</p>
          <p className="text-xs text-slate-500">comprados</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-lg font-bold text-slate-950">{stats.pending}</p>
          <p className="text-xs text-slate-500">faltam</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
        <button
          type="button"
          onClick={() => onOpen(list.id)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <ExternalLink size={17} aria-hidden="true" />
          Abrir
        </button>
        <button
          type="button"
          onClick={() => onDuplicate(list)}
          disabled={busy}
          className="inline-flex min-h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          aria-label="Duplicar lista"
          title="Duplicar lista"
        >
          <Copy size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(list)}
          disabled={busy}
          className="inline-flex min-h-11 w-11 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-60"
          aria-label="Excluir lista"
          title="Excluir lista"
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

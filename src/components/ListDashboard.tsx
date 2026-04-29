"use client";

import { Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ListCard } from "./ListCard";
import type { ListStats, ShoppingList } from "@/lib/types";

type ListDashboardProps = {
  lists: ShoppingList[];
  statsByList: Record<string, ListStats>;
  loading: boolean;
  busy?: boolean;
  error?: string;
  onCreateList: () => void;
  onOpenList: (listId: string) => void;
  onDuplicateList: (list: ShoppingList) => void;
  onDeleteList: (list: ShoppingList) => void;
};

export function ListDashboard({
  lists,
  statsByList,
  loading,
  busy,
  error,
  onCreateList,
  onOpenList,
  onDuplicateList,
  onDeleteList,
}: ListDashboardProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Suas listas</h1>
          <p className="mt-1 text-sm text-slate-600">Crie, reutilize e acompanhe suas compras.</p>
        </div>
        <button
          type="button"
          onClick={onCreateList}
          disabled={busy}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Plus size={18} aria-hidden="true" />
          Nova
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
          Carregando listas...
        </div>
      ) : null}

      {!loading && lists.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="Nenhuma lista ainda"
            description="Crie sua primeira lista de mercado e adicione os itens enquanto organiza a compra."
            action="Toque em Nova lista para começar."
          />
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            stats={statsByList[list.id] ?? { total: 0, purchased: 0, pending: 0 }}
            busy={busy}
            onOpen={onOpenList}
            onDuplicate={onDuplicateList}
            onDelete={onDeleteList}
          />
        ))}
      </div>
    </section>
  );
}

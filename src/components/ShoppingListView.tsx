"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, RotateCcw, Trash2 } from "lucide-react";
import { AddItemForm } from "./AddItemForm";
import { CategorySection } from "./CategorySection";
import { EmptyState } from "./EmptyState";
import { CATEGORIES } from "@/lib/categories";
import type { Category, ShoppingItem, ShoppingList } from "@/lib/types";
import { getCompletionPercent, getListStats, sortItems } from "@/lib/utils";

type ShoppingListViewProps = {
  list: ShoppingList;
  items: ShoppingItem[];
  busy?: boolean;
  error?: string;
  onBack: () => void;
  onRename: (list: ShoppingList, name: string) => Promise<void>;
  onAddItem: (payload: { name: string; quantity: string | null; category: Category }) => Promise<void>;
  onToggleItem: (item: ShoppingItem) => void;
  onEditItem: (
    item: ShoppingItem,
    payload: { name: string; quantity: string | null; category: Category },
  ) => Promise<void>;
  onDeleteItem: (item: ShoppingItem) => void;
  onMoveItem: (item: ShoppingItem, direction: "up" | "down") => void;
  onClearPurchased: () => void;
  onUncheckAll: () => void;
  onDuplicateList: (list: ShoppingList) => void;
  onDeleteList: (list: ShoppingList) => void;
};

export function ShoppingListView({
  list,
  items,
  busy,
  error,
  onBack,
  onRename,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
  onClearPurchased,
  onUncheckAll,
  onDuplicateList,
  onDeleteList,
}: ShoppingListViewProps) {
  const [name, setName] = useState(list.name);
  const [renaming, setRenaming] = useState(false);
  const stats = getListStats(items);
  const percent = getCompletionPercent(items);

  useEffect(() => {
    setName(list.name);
  }, [list.id, list.name]);

  const groupedItems = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        items: sortItems(items.filter((item) => item.category === category)),
      })),
    [items],
  );

  async function saveName() {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === list.name) {
      setName(list.name);
      return;
    }

    setRenaming(true);
    await onRename(list, trimmedName);
    setRenaming(false);
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }

    if (event.key === "Escape") {
      setName(list.name);
      event.currentTarget.blur();
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDuplicateList(list)}
            disabled={busy}
            className="inline-flex min-h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            aria-label="Duplicar lista"
            title="Duplicar lista"
          >
            <Copy size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteList(list)}
            disabled={busy}
            className="inline-flex min-h-11 w-11 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-60"
            aria-label="Excluir lista"
            title="Excluir lista"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
        <label className="sr-only" htmlFor="list-name">
          Nome da lista
        </label>
        <input
          id="list-name"
          value={name}
          onChange={handleNameChange}
          onBlur={saveName}
          onKeyDown={handleNameKeyDown}
          className="w-full rounded-lg border border-transparent bg-slate-50 px-3 py-2 text-2xl font-bold tracking-tight text-slate-950 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          disabled={renaming}
        />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <SummaryTile label="Itens" value={stats.total} />
          <SummaryTile label="Comprados" value={stats.purchased} />
          <SummaryTile label="Pendentes" value={stats.pending} />
          <SummaryTile label="Concluído" value={`${percent}%`} />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-4">
        <AddItemForm busy={busy} onAdd={onAddItem} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onUncheckAll}
          disabled={busy || items.length === 0 || stats.purchased === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RotateCcw size={17} aria-hidden="true" />
          Desmarcar todos
        </button>
        <button
          type="button"
          onClick={onClearPurchased}
          disabled={busy || stats.purchased === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={17} aria-hidden="true" />
          Remover comprados
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Lista vazia"
            description="Adicione os itens do mercado. O app salva tudo no Supabase automaticamente."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {groupedItems.map(({ category, items: categoryItems }) => (
            <CategorySection
              key={category}
              category={category}
              items={categoryItems}
              busy={busy}
              onToggle={onToggleItem}
              onDelete={onDeleteItem}
              onMove={onMoveItem}
              onEdit={onEditItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

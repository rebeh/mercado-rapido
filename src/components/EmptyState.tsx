type EmptyStateProps = {
  title: string;
  description: string;
  action?: string;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <p className="mt-4 text-sm font-medium text-emerald-700">{action}</p> : null}
    </div>
  );
}

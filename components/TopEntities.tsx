export default function TopEntities({
  title,
  items,
}: {
  title: string;
  items: { name: string; value: string; helper: string }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-night-800/80 p-5 shadow-card">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {index + 1}. {item.name}
              </p>
              <p className="text-xs text-slate-400">{item.helper}</p>
            </div>
            <span className="text-sm text-neon-cyan font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

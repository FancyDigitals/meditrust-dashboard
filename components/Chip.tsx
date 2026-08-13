type ChipType = "green" | "red" | "amber" | "blue" | "gray";

const styles: Record<ChipType, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  red:   "bg-red-50 text-red-700 border-red-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue:  "bg-blue-50 text-blue-700 border-blue-200",
  gray:  "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Chip({
  type = "green",
  children,
}: {
  type?: ChipType;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${styles[type]}`}
    >
      {children}
    </span>
  );
}
"use client";

import { Menu, ShieldCheck } from "lucide-react";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: Props) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 hover:text-slate-800 p-1"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-400 leading-none mt-0.5">
          MediTrust Health Cloud
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
          Academic Demo
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
          <ShieldCheck size={14} />
          Protected
        </span>
      </div>
    </header>
  );
}
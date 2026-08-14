"use client";

import { Menu, ShieldCheck, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: Props) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user as any;

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
          Hallmark Medical Center
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
          Academic Demo
        </span>

        <span className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
          <ShieldCheck size={14} />
          Protected
        </span>

        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: user.color ?? "#0f172a" }}
              >
                {user.initials ?? "?"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-semibold text-slate-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {user.role}
                </p>
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-[12px] font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user.email}</p>
                  </div>
                  <div className="px-4 py-2.5 border-b border-slate-100 space-y-1.5">
                    {[
                      ["Role", user.role],
                      ["Group", user.group],
                      ["Access", user.access],
                      ["MFA", user.mfa ?? "Required"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{label}</span>
                        <span className="font-semibold text-slate-700">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";

export default function DeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <ShieldX size={28} className="text-red-400" />
        </div>
        <h1 className="text-[22px] font-extrabold text-white mb-2">
          Access Denied
        </h1>
        <p className="text-[13px] text-slate-400 mb-2 leading-relaxed">
          Your role does not have permission to view this page.
        </p>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <Lock size={11} className="text-slate-600" />
          <span className="text-[11px] font-mono text-slate-600">
            Zero Trust — Least Privilege Enforced
          </span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 bg-white text-slate-900 rounded-lg px-5 py-2.5 text-[13px] font-semibold hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
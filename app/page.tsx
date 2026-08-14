"use client";

import { useState } from "react";
import { ShieldCheck, Lock, KeyRound, Database, CheckCircle2 } from "lucide-react";
import Chip from "@/components/Chip";
import { flowSteps, activity } from "@/lib/data";

const overviewCards = [
  { label: "Identity",       status: "Protected", detail: "Microsoft Entra ID",       sub: "7 simulated users",        icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Access Control", status: "Protected", detail: "Azure RBAC",               sub: "Least privilege enforced", icon: Lock,        color: "text-blue-500",    bg: "bg-blue-50"    },
  { label: "Authentication", status: "Protected", detail: "MFA + Conditional Access", sub: "Risk-based verification",  icon: KeyRound,    color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Data Security",  status: "Protected", detail: "Private Azure Storage",    sub: "TLS 1.2+ enforced",        icon: Database,    color: "text-blue-500",    bg: "bg-blue-50"    },
];

const resultStyle: Record<string, string> = {
  allowed: "bg-emerald-50 text-emerald-700",
  denied:  "bg-red-50 text-red-700",
  blocked: "bg-amber-50 text-amber-700",
  mfa:     "bg-blue-50 text-blue-700",
};

export default function DashboardPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState("all");

  const filtered = activity.slice(0, 6).filter((a) => {
    if (logFilter === "all") return true;
    return a.type === logFilter;
  });

  return (
    <div className="p-5 space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Zero Trust Security</h1>
          <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            Academic Demo
          </span>
        </div>
        <p className="text-[13px] text-slate-400 mt-1">Hallmark Medical Center — Simulated Azure EHR Environment</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={card.color} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{card.label}</p>
              <p className="text-[14px] font-bold text-slate-900 mb-1">{card.status}</p>
              <p className="text-[12px] text-slate-500">{card.detail}</p>
              <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-slate-900">Access Verification Flow</p>
            <p className="text-[11px] text-slate-400">Click any step</p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 flex-wrap">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                    className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-lg border text-[10px] font-medium transition-all
                      ${activeStep === i
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                  >
                    <span className="text-base leading-none">{step.icon}</span>
                    <span className="leading-tight text-center">{step.label}</span>
                  </button>
                  {i < flowSteps.length - 1 && <span className="text-slate-300 text-sm">→</span>}
                </div>
              ))}
            </div>
            {activeStep !== null && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-[12px] font-semibold text-blue-800 mb-1">{flowSteps[activeStep].label}</p>
                <p className="text-[12px] text-blue-700 leading-relaxed">{flowSteps[activeStep].tooltip}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <p className="text-[13px] font-semibold text-slate-900">Zero Trust Coverage</p>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-2 mb-4">
              <p className="text-4xl font-black text-slate-900">6/6</p>
              <p className="text-[11px] text-slate-400 mb-1 leading-tight">Controls<br />Active</p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
              <div className="h-full w-full bg-emerald-500 rounded-full" />
            </div>
            <div className="space-y-2">
              {[
                "Identity (Entra ID)",
                "Least Privilege (RBAC)",
                "MFA (Conditional Access)",
                "Risk-Based Access",
                "Data Protection",
                "Monitoring (Audit Logs)",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <p className="text-[13px] font-semibold text-slate-900">Recent Security Activity</p>
          <div className="flex gap-1.5 flex-wrap">
            {["all", "allowed", "denied", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors capitalize
                  ${logFilter === f
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-slate-400 py-10">No events match this filter.</p>
          ) : filtered.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.type === "allowed" ? "bg-emerald-500" : ev.type === "denied" ? "bg-red-500" : ev.type === "blocked" ? "bg-amber-500" : "bg-blue-500"}`} />
              <span className="text-[11px] text-slate-400 font-mono w-10 flex-shrink-0">{ev.time}</span>
              <span className="text-[12px] font-semibold text-slate-800 w-32 truncate flex-shrink-0">{ev.user}</span>
              <span className="text-[12px] text-slate-600 flex-1">{ev.event}</span>
              <span className="text-[11px] text-slate-400 hidden sm:block flex-shrink-0 w-28">{ev.resource}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${resultStyle[ev.type]}`}>{ev.result}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">Access Control Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["User","Role","Resource","Permission","Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Doctor User","Doctor","Patient Records","Read / Write","Allowed"],
                ["Nurse User","Nurse","Patient Records","Read Only","Allowed"],
                ["Records Admin User","Records Admin","Admin Records","Read","Allowed"],
                ["Auditor User","Auditor","Audit Evidence","Read","Allowed"],
                ["Vendor User","Vendor","Patient Records","None","Denied"],
                ["Cloud Admin User","Cloud Admin","All Resources","Admin","Allowed"],
                ["IT Security Admin User","IT Security","Audit Evidence","Read","Allowed"],
              ].map(([u, r, res, p, s]) => (
                <tr key={u} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{u}</td>
                  <td className="px-4 py-3 text-slate-600">{r}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{res}</td>
                  <td className="px-4 py-3 text-slate-600">{p}</td>
                  <td className="px-4 py-3"><Chip type={s === "Allowed" ? "green" : "red"}>{s}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
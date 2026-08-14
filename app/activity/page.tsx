"use client";

import { useState } from "react";
import { activity } from "@/lib/data";

const filters = ["all","allowed","denied","blocked","mfa"];

const resultStyle: Record<string, string> = {
  allowed: "bg-emerald-50 text-emerald-700",
  denied:  "bg-red-50 text-red-700",
  blocked: "bg-amber-50 text-amber-700",
  mfa:     "bg-blue-50 text-blue-700",
};

const riskStyle: Record<string, string> = {
  Low:    "text-emerald-600",
  Medium: "text-amber-600",
  High:   "text-red-600",
};

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const filtered = activity.filter((a) => filter === "all" || a.type === filter);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
        <p className="text-[13px] text-slate-400 mt-1">Security events and audit activity - Demonstration data</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center gap-3 justify-between">
          <p className="text-[13px] font-semibold text-slate-900">Security Events</p>
          <div className="flex gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors capitalize
                  ${filter === f
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
              >
                {f === "mfa" ? "MFA" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Time","User","Event","Resource","Risk","Result"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-[12px] text-slate-400 py-12">No events match this filter.</td></tr>
              ) : filtered.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{ev.time}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{ev.user}</td>
                  <td className="px-4 py-3 text-slate-600">{ev.event}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{ev.resource}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${riskStyle[ev.risk] ?? "text-slate-600"}`}>{ev.risk}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${resultStyle[ev.type]}`}>{ev.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
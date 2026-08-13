"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Chip from "@/components/Chip";
import { policies } from "@/lib/data";

type Policy = (typeof policies)[0];

interface PolicyRowItem {
  label: string;
  value: string;
}

function getPolicyRows(p: Policy): PolicyRowItem[] {
  const rows: PolicyRowItem[] = [
    { label: "Condition", value: p.condition },
    { label: "Action",    value: p.action    },
    { label: "Target",    value: p.target    },
  ];
  if (p.exception) {
    rows.push({ label: "Exception", value: p.exception });
  }
  return rows;
}

export default function PoliciesPage() {
  const [selected, setSelected] = useState<Policy | null>(null);

  return (
    <div className="p-5 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Security Policies
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Microsoft Entra ID Conditional Access — Simulated configuration
        </p>
      </div>

      {/* Policy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {policies.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                {p.id}
              </span>
              <Chip type="green">Active</Chip>
            </div>

            <p className="text-[14px] font-bold text-slate-900 mb-3">
              {p.name}
            </p>

            <div className="space-y-2">
              {getPolicyRows(p).map((row) => (
                <div key={row.label} className="flex justify-between gap-2 text-[11px]">
                  <span className="text-slate-400 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-700 font-semibold text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-blue-500 font-semibold mt-3">
              View details →
            </p>
          </button>
        ))}
      </div>

      {/* PIM note */}
      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-white">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[13px] font-bold text-slate-900">
                Privileged Identity Management
              </p>
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                Recommended Enhancement
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Microsoft Entra Privileged Identity Management (PIM) provides
              just-in-time privileged access with time-bound role activation.
              This is documented as a recommended production enhancement. In a
              live environment, PIM would ensure Cloud Admin and IT Security
              roles are only active when explicitly needed, reducing standing
              privilege exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Policy modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  {selected.id}
                </p>
                <p className="text-white font-bold text-[15px]">
                  {selected.name}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white mt-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Status
                </p>
                <Chip type="green">Active — Demonstration</Chip>
              </div>

              {getPolicyRows(selected).map((row) => (
                <div key={row.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    {row.label}
                  </p>
                  <p className="text-[13px] font-medium text-slate-800">
                    {row.value}
                  </p>
                </div>
              ))}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Purpose
                </p>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {selected.purpose}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
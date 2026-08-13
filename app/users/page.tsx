"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Chip from "@/components/Chip";
import { users, groups } from "@/lib/data";

export default function UsersPage() {
  const [selected, setSelected] = useState<typeof users[0] | null>(null);

  return (
    <div className="p-5 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Users</h1>
        <p className="text-[13px] text-slate-400 mt-1">Simulated healthcare roles and Entra ID security group assignments</p>
      </div>

      {/* User cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelected(user)}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                style={{ background: user.color }}
              >
                {user.initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Group</span>
                <span className="font-mono font-semibold text-slate-700">{user.group}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Access</span>
                <span className="text-slate-700 font-semibold">{user.access}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">MFA</span>
                <Chip type="green">{user.mfa}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Status</span>
                <Chip type={user.status === "Protected" ? "green" : "red"}>{user.status}</Chip>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Security groups */}
      <div>
        <div className="bg-white border border-slate-200 rounded-t-lg px-5 py-3.5 border-b flex items-center justify-between">
          <p className="text-[13px] font-semibold text-slate-900">Security Groups</p>
          <p className="text-[11px] text-slate-400">Microsoft Entra ID — Group-based access</p>
        </div>
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.map((g) => (
              <div key={g.id} className="border border-slate-200 rounded-lg p-3.5">
                <p className="font-mono text-[12px] font-bold text-slate-900 mb-1">{g.id}</p>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  {g.members} member — {g.memberList.join(", ")}
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Access</span>
                    <span className="font-semibold text-slate-700">{g.access}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Permission</span>
                    <span className="font-semibold text-slate-700">{g.permission}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: selected.color }}>
                  {selected.initials}
                </div>
                <div>
                  <p className="text-white font-bold text-[14px]">{selected.name}</p>
                  <p className="text-slate-400 text-[11px]">{selected.username}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["Role", selected.role],
                ["Security Group", selected.group],
                ["Access", selected.access],
                ["MFA", selected.mfa],
                ["Risk Policies", selected.riskPolicy],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</p>
                  <p className="text-[13px] font-medium text-slate-800">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Status</p>
                <Chip type={selected.status === "Protected" ? "green" : "red"}>{selected.status}</Chip>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
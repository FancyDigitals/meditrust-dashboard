"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Circle, ShieldCheck } from "lucide-react";
import { evaluateAccess } from "@/lib/permissions";
import { users } from "@/lib/data";

const resourceMap: Record<string, string> = {
  "Patient Records": "patient-records",
  "Admin Records":   "admin-records",
  "Audit Evidence":  "audit-evidence",
};

const STEPS = [
  "Checking identity...",
  "Verifying MFA status...",
  "Evaluating risk level...",
  "Checking role assignment...",
  "Checking permissions...",
];

type Phase = "idle" | "checking" | "result";

export default function TestAccessPage() {
  const [selectedUser, setSelectedUser]     = useState("Doctor User");
  const [selectedResource, setSelectedResource] = useState("Patient Records");
  const [selectedAction, setSelectedAction] = useState("read");
  const [phase, setPhase]   = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [decision, setDecision] = useState<ReturnType<typeof evaluateAccess> | null>(null);

  const userObj = users.find((u) => u.name === selectedUser);

  const handleCheck = () => {
    setPhase("checking");
    setStepIdx(0);
    setDecision(null);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStepIdx(i);
      if (i >= STEPS.length) {
        clearInterval(interval);
        const result = evaluateAccess(selectedUser, resourceMap[selectedResource], selectedAction);
        setDecision(result);
        setPhase("result");
      }
    }, 320);
  };

  const reset = () => { setPhase("idle"); setDecision(null); setStepIdx(0); };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Test Access</h1>
        <p className="text-[13px] text-slate-400 mt-1">Demonstrate Zero Trust access decisions — live permission engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <p className="text-[13px] font-semibold text-slate-900">Access Request</p>
          </div>
          <div className="p-5 space-y-4">

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Select User</label>
              <select
                value={selectedUser}
                onChange={(e) => { setSelectedUser(e.target.value); reset(); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {users.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
              {userObj && (
                <p className="text-[11px] text-slate-400 mt-1.5 bg-slate-50 rounded px-2.5 py-1.5 border border-slate-100">
                  <span className="font-semibold text-slate-700">{userObj.role}</span> · {userObj.group} · MFA: {userObj.mfa}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Select Resource</label>
              <select
                value={selectedResource}
                onChange={(e) => { setSelectedResource(e.target.value); reset(); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.keys(resourceMap).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Select Action</label>
              <select
                value={selectedAction}
                onChange={(e) => { setSelectedAction(e.target.value); reset(); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {["read","write","delete","manage"].map((a) => (
                  <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCheck}
              disabled={phase === "checking"}
              className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {phase === "checking" ? "Checking..." : "Check Access →"}
            </button>

            {phase !== "idle" && (
              <button
                onClick={reset}
                className="w-full border border-slate-200 text-slate-600 rounded-lg py-2 text-[12px] font-semibold hover:border-slate-400 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Decision panel */}
        <div>
          {phase === "idle" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm h-full flex flex-col items-center justify-center text-center p-10 gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <ShieldCheck size={24} className="text-slate-400" />
              </div>
              <p className="text-[14px] font-semibold text-slate-900">Ready to evaluate</p>
              <p className="text-[12px] text-slate-400 leading-relaxed max-w-[200px]">
                Select a user, resource, and action then click Check Access.
              </p>
            </div>
          )}

          {phase === "checking" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-5 py-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Evaluating Request</p>
                <p className="text-white font-bold">{selectedUser} → {selectedResource}</p>
              </div>
              <div className="p-5 space-y-2">
                {STEPS.map((step, i) => (
                  <div key={step} className={`flex items-center gap-3 p-2.5 rounded-lg border text-[12px] transition-all ${i < stepIdx ? "border-emerald-200 bg-emerald-50" : i === stepIdx ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-slate-50"}`}>
                    {i < stepIdx
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      : i === stepIdx
                      ? <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
                      : <Circle size={14} className="text-slate-300 flex-shrink-0" />
                    }
                    <span className={i <= stepIdx ? "text-slate-800 font-medium" : "text-slate-400"}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "result" && decision && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className={`px-5 py-4 text-center ${decision.allowed ? "bg-emerald-500" : "bg-red-500"}`}>
                <p className="text-white font-black text-[15px] uppercase tracking-wide">
                  {decision.allowed ? "✓ Access Granted" : "✗ Access Denied"}
                </p>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <p className="font-bold text-slate-900 text-[14px]">{selectedUser}</p>
                  <p className="text-slate-300 text-lg my-1">↓</p>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded">{selectedResource}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Action: {selectedAction}</p>
                </div>
                <div className="text-[11px] text-slate-500 text-center bg-slate-50 rounded-lg px-3 py-2 mb-4 leading-relaxed border border-slate-100">
                  {decision.reason}
                </div>
                <div className="space-y-1.5 mb-4">
                  {decision.checks.map((check) => (
                    <div key={check.label} className={`flex items-center justify-between p-2.5 rounded-lg border text-[12px] ${check.ok ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                      <span className="font-medium text-slate-700">{check.label}</span>
                      <span className={`flex items-center gap-1.5 font-semibold ${check.ok ? "text-emerald-600" : "text-red-600"}`}>
                        {check.ok
                          ? <CheckCircle2 size={13} />
                          : <XCircle size={13} />
                        }
                        {check.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`text-center py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wide ${decision.allowed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  Final Decision: {decision.allowed ? `Allow ${selectedAction.toUpperCase()}` : "Block Access"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-[12px] font-semibold text-blue-800 mb-0.5">Demonstration Tip</p>
        <p className="text-[12px] text-blue-700 leading-relaxed">
          Try <strong>Vendor User → Patient Records → Read</strong> (Denied) &nbsp;|&nbsp;
          <strong>Nurse User → Patient Records → Read</strong> (Granted) &nbsp;|&nbsp;
          <strong>Nurse User → Patient Records → Write</strong> (Denied — read-only role)
        </p>
      </div>
    </div>
  );
}
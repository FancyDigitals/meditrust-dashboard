import { Database, File } from "lucide-react";
import Chip from "@/components/Chip";
import { resources, permissionMatrix } from "@/lib/data";

const roles = ["Doctor","Nurse","Records Admin","Auditor","Vendor","Cloud Admin","IT Security"];
const containers = ["patient-records","admin-records","audit-evidence"];

function PermCell({ value }: { value: string }) {
  if (value === "RW") return <span className="text-[12px] font-bold text-blue-600">RW</span>;
  if (value === "R")  return <span className="text-[12px] font-bold text-emerald-600">R</span>;
  if (value === "Admin") return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">ADMIN</span>;
  return <span className="text-slate-300 text-[12px]">—</span>;
}

export default function AccessControlPage() {
  return (
    <div className="p-5 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access Control</h1>
        <p className="text-[13px] text-slate-400 mt-1">Least-privilege permissions across the simulated EHR environment</p>
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {resources.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center mb-3">
              <Database size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-mono text-[13px] font-bold text-slate-900">{r.label}</p>
              <Chip type="red">Private</Chip>
            </div>
            <p className="text-[12px] text-slate-500 mb-3 leading-relaxed">{r.desc}</p>
            <div className="space-y-1.5 text-[11px] mb-3">
              {[["Anonymous Access","Disabled"],["Secure Transfer","Enabled"],["TLS","1.2+"],["Data","Dummy Only"]].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-semibold text-slate-700">{v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Simulated Files</p>
              {r.files.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mb-1">
                  <File size={10} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <p className="text-[13px] font-semibold text-slate-900">Permission Matrix</p>
          <p className="text-[11px] text-slate-400">R = Read · RW = Read/Write · — = No Access</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-4 py-2.5 sticky left-0 bg-slate-50">Role</th>
                {containers.map((c) => (
                  <th key={c} className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-4 py-2.5 font-mono normal-case">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((role) => (
                <tr key={role} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 sticky left-0 bg-white">{role}</td>
                  {containers.map((c) => (
                    <td key={c} className="px-4 py-3">
                      <PermCell value={permissionMatrix[role]?.[c] ?? "—"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage tree */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">Azure Storage Structure</p>
        </div>
        <div className="p-5 font-mono text-[12px] text-slate-600 leading-8">
          <p><span className="font-bold text-slate-900">Azure Storage Account</span></p>
          <p className="pl-5">└── <span className="font-bold text-slate-900">Hallmark Medical Center EHR Storage</span></p>
          {resources.map((r, i) => (
            <div key={r.id}>
              <p className="pl-10">{i < resources.length - 1 ? "├──" : "└──"} <span className="text-blue-600 font-bold">{r.label}</span> <span className="text-[10px] font-sans font-bold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded ml-1">PRIVATE</span></p>
              {r.files.map((f, fi) => (
                <p key={f} className="pl-20 text-slate-400">{fi < r.files.length - 1 ? "├──" : "└──"} {f}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
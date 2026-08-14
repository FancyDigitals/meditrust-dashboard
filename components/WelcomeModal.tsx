"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  X,
  ArrowRight,
  Lock,
  Users,
  FlaskConical,
  Cloud,
  KeyRound,
  Database,
  Activity,
  Eye,
  UserCheck,
  Shield,
  Server,
  Fingerprint,
  AlertTriangle,
  FolderLock,
  MonitorCheck,
} from "lucide-react";
import Image from "next/image";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  const steps = [
    // ── Step 0 — Welcome ──
    <div key="welcome" className="text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center mb-5 shadow-lg">
        <ShieldCheck size={28} className="text-white" />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[3px] text-slate-400 mb-3">
        Zero Trust Security
      </p>
      <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-1">
        MediTrust Health Cloud
      </h2>
      <p className="text-[13px] text-slate-400 mb-6">
        Security Dashboard — Academic Demonstration
      </p>

      {/* Presenter card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-slate-400 mb-4">
          Presented by
        </p>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-lg ring-2 ring-slate-200">
            <Image
              src="/avatar.jpg"
              alt="Adegunle Kanyinsola Olayinka"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-bold text-slate-900 leading-tight">
              Adegunle Kanyinsola Olayinka
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              MIT Final Year Project
            </p>
          </div>
        </div>
      </div>

      {/* Dissertation title */}
      <div className="bg-slate-900 rounded-xl p-4 mb-6 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Dissertation
        </p>
        <p className="text-[12px] font-semibold text-white leading-relaxed">
          Implementing and Evaluating Zero Trust Access Control for Cloud-Based
          Electronic Health Records (EHR) Systems Using Microsoft Azure Entra ID
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: Shield, label: "Zero Trust", color: "text-blue-500" },
          { icon: Cloud, label: "Azure Cloud", color: "text-sky-500" },
          { icon: Activity, label: "Healthcare", color: "text-emerald-500" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-slate-50 border border-slate-100 rounded-lg py-3 px-2 text-center flex flex-col items-center gap-1.5"
            >
              <Icon size={18} className={item.color} />
              <span className="text-[10px] font-semibold text-slate-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full bg-slate-900 text-white rounded-xl py-3 text-[13px] font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        Quick Overview
        <ArrowRight size={14} />
      </button>
      <button
        onClick={() => setOpen(false)}
        className="w-full mt-2 text-[12px] text-slate-400 hover:text-slate-600 py-2 font-medium transition-colors"
      >
        Skip — Go to Dashboard
      </button>
    </div>,

    // ── Step 1 — What you'll see ──
    <div key="overview">
      <div className="text-center mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-slate-400 mb-2">
          Quick Overview
        </p>
        <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
          What This Dashboard Demonstrates
        </h2>
      </div>

      <div className="space-y-2.5 mb-6">
        {[
          {
            icon: ShieldCheck,
            title: "Zero Trust Architecture",
            desc: "Every access request is verified through identity, MFA, risk, role, and permission never trusted automatically.",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            icon: Users,
            title: "7 Simulated Healthcare Roles",
            desc: "Doctors, Nurses, Vendors, Auditors, Admins — each with different access levels reflecting real-world healthcare.",
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            icon: Lock,
            title: "Least-Privilege Access Control",
            desc: "Azure RBAC ensures each user only has the minimum permissions needed for their role.",
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            icon: FlaskConical,
            title: "Live Access Testing",
            desc: "Test any user + resource + action combination and see the Zero Trust decision engine in real time.",
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <Icon size={14} className={item.color} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-900 mb-0.5">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Eye size={13} className="text-blue-600" />
          <p className="text-[11px] font-semibold text-blue-800">
            Recommended Demo Path
          </p>
        </div>
        <p className="text-[11px] text-blue-700 leading-relaxed">
          Dashboard → Users → Access Control → Security Policies → Test Access
        </p>
        <p className="text-[10px] text-blue-500 mt-1.5">
          Try: <strong>Vendor User → Patient Records → Read</strong> to see a
          denied request
        </p>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full bg-slate-900 text-white rounded-xl py-3 text-[13px] font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        Azure Implementation
        <ArrowRight size={14} />
      </button>
      <button
        onClick={() => setStep(0)}
        className="w-full mt-2 text-[12px] text-slate-400 hover:text-slate-600 py-2 font-medium transition-colors"
      >
        ← Back
      </button>
    </div>,

    // ── Step 2 — Azure stack ──
    <div key="azure">
      <div className="text-center mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-slate-400 mb-2">
          Technical Foundation
        </p>
        <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
          Azure Security Stack
        </h2>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: UserCheck, label: "Microsoft Entra ID", detail: "Identity & Auth" },
            { icon: KeyRound, label: "Conditional Access", detail: "CA001 – CA004" },
            { icon: Lock, label: "Azure RBAC", detail: "Least Privilege" },
            { icon: Fingerprint, label: "MFA", detail: "All EHR Users" },
            { icon: Database, label: "Azure Blob Storage", detail: "3 Private Containers" },
            { icon: AlertTriangle, label: "Entra ID Protection", detail: "Risk-Based Policies" },
            { icon: FolderLock, label: "Security Groups", detail: "7 EHR Groups" },
            { icon: MonitorCheck, label: "Azure Monitor", detail: "Audit & Logging" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col items-center gap-1.5 text-center"
              >
                <Icon size={15} className="text-slate-400" />
                <p className="text-[10px] font-semibold text-white leading-tight">
                  {item.label}
                </p>
                <p className="text-[9px] text-slate-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-900">
            6 / 6 Zero Trust Controls Active
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
            Identity · Least Privilege · MFA · Risk-Based Access · Data
            Protection · Monitoring
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={12} className="text-amber-600" />
          <p className="text-[10px] font-semibold text-amber-700">
            Academic Demonstration Only
          </p>
        </div>
        <p className="text-[10px] text-amber-600 leading-relaxed">
          No real patient data is used. All users, records, and events are fully
          simulated for educational purposes.
        </p>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="w-full bg-emerald-500 text-white rounded-xl py-3 text-[13px] font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
      >
        Enter Dashboard
        <ArrowRight size={14} />
      </button>
      <button
        onClick={() => setStep(1)}
        className="w-full mt-2 text-[12px] text-slate-400 hover:text-slate-600 py-2 font-medium transition-colors"
      >
        ← Back
      </button>
    </div>,
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors z-10"
          aria-label="Close welcome"
        >
          <X size={16} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-5">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                step === i
                  ? "bg-slate-900 w-5"
                  : "bg-slate-200 hover:bg-slate-300 w-2"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">{steps[step]}</div>
      </div>
    </div>
  );
}
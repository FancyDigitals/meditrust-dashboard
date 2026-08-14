"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Shield,
  KeyRound,
  UserCheck,
  CheckCircle2,
  Circle,
  XCircle,
  Fingerprint,
  AlertTriangle,
  Database,
  ClipboardCheck,
  MonitorCheck,
} from "lucide-react";
import Image from "next/image";
import { authUsers } from "@/lib/auth-users";

// ── Verification steps that mirror the real Zero Trust flow ──
const LOGIN_STEPS = [
  {
    id: "dns",
    label: "Resolving secure endpoint",
    detail: "Connecting to MediTrust Health Cloud authentication gateway",
    icon: MonitorCheck,
  },
  {
    id: "tls",
    label: "Establishing TLS 1.2+ encrypted channel",
    detail: "Secure transfer enforced — all traffic encrypted in transit",
    icon: Lock,
  },
  {
    id: "identity",
    label: "Verifying identity with Microsoft Entra ID",
    detail: "Checking user credentials against Entra ID directory",
    icon: UserCheck,
  },
  {
    id: "group",
    label: "Resolving security group membership",
    detail: "Mapping user to assigned EHR security group",
    icon: Shield,
  },
  {
    id: "ca001",
    label: "Evaluating CA001 — MFA requirement for EHR users",
    detail: "Conditional Access Policy CA001 requires multifactor authentication for all EHR groups",
    icon: KeyRound,
  },
  {
    id: "ca002",
    label: "Evaluating CA002 — checking sign-in risk level",
    detail: "Entra ID Protection assessing sign-in risk — high-risk sign-ins are blocked immediately",
    icon: AlertTriangle,
  },
  {
    id: "ca003",
    label: "Evaluating CA003 — medium-risk MFA policy",
    detail: "Medium-risk sign-ins require an additional MFA challenge before access is granted",
    icon: AlertTriangle,
  },
  {
    id: "rbac",
    label: "Loading Azure RBAC role assignments",
    detail: "Determining least-privilege permissions based on security group and role assignment",
    icon: ClipboardCheck,
  },
  {
    id: "storage",
    label: "Verifying storage container access permissions",
    detail: "Checking user permissions against private containers: patient-records, admin-records, audit-evidence",
    icon: Database,
  },
  {
    id: "mfa_required",
    label: "MFA verification required",
    detail: "CA001 policy enforced — redirecting to multifactor authentication challenge",
    icon: Fingerprint,
  },
];

const ADMIN_EXTRA_STEP = {
  id: "ca004",
  label: "Evaluating CA004 — admin MFA enforcement",
  detail: "Administrative roles require a separate MFA gate independently of CA001",
  icon: ShieldCheck,
};

const MFA_STEPS = [
  {
    id: "mfa_receive",
    label: "Receiving authenticator code",
    detail: "Verifying 6-digit code from the registered authenticator application",
    icon: Fingerprint,
  },
  {
    id: "mfa_validate",
    label: "Validating MFA token",
    detail: "Confirming multifactor authentication — CA001 requirement satisfied",
    icon: ShieldCheck,
  },
  {
    id: "session",
    label: "Creating secure session",
    detail: "Generating JWT session token with role, group, and permission claims",
    icon: KeyRound,
  },
  {
    id: "audit",
    label: "Logging authentication event",
    detail: "Recording successful sign-in to Azure Monitor audit trail",
    icon: ClipboardCheck,
  },
  {
    id: "complete",
    label: "Authentication complete — access granted",
    detail: "All Zero Trust checks passed. Redirecting to dashboard.",
    icon: CheckCircle2,
  },
];

type Phase = "form" | "verifying" | "mfa" | "mfa_verifying" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [stepIdx, setStepIdx] = useState(0);
  const [loginSteps, setLoginSteps] = useState(LOGIN_STEPS);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaStepIdx, setMfaStepIdx] = useState(0);
  const [verifiedUser, setVerifiedUser] = useState<(typeof authUsers)[0] | null>(null);
  const [loginFailed, setLoginFailed] = useState(false);
  const [failAtStep, setFailAtStep] = useState(-1);

  // Build the login steps based on whether user is admin
  const buildSteps = useCallback((uname: string) => {
    const user = authUsers.find(
      (u) => u.username.toLowerCase() === uname.toLowerCase()
    );
    const isAdmin =
      user?.group === "EHR-Cloud-Admins" || user?.group === "EHR-IT-Security";

    if (isAdmin) {
      const steps = [...LOGIN_STEPS];
      // Insert CA004 step after CA003
      const ca003Idx = steps.findIndex((s) => s.id === "ca003");
      steps.splice(ca003Idx + 1, 0, ADMIN_EXTRA_STEP);
      return steps;
    }
    return [...LOGIN_STEPS];
  }, []);

  // Run login verification animation
  const runVerification = useCallback(
    async (uname: string, pwd: string) => {
      const steps = buildSteps(uname);
      setLoginSteps(steps);
      setPhase("verifying");
      setStepIdx(0);
      setLoginFailed(false);
      setFailAtStep(-1);

      // Animate through steps
      for (let i = 0; i < steps.length; i++) {
        setStepIdx(i);
        const delay = steps[i].id === "identity" ? 1200 : 500 + Math.random() * 400;
        await new Promise((r) => setTimeout(r, delay));

        // At the identity step, actually check credentials
        if (steps[i].id === "identity") {
          const result = await signIn("credentials", {
            username: uname,
            password: pwd,
            redirect: false,
          });

          if (result?.error) {
            setFailAtStep(i);
            setLoginFailed(true);
            await new Promise((r) => setTimeout(r, 1500));
            setError("Identity verification failed. Credentials not recognised by Entra ID.");
            setPhase("error");
            return;
          }

          // Find the user for display
          const user = authUsers.find(
            (u) => u.username.toLowerCase() === uname.toLowerCase()
          );
          setVerifiedUser(user ?? null);
        }
      }

      // All pre-MFA steps done — move to MFA
      setPhase("mfa");
    },
    [buildSteps]
  );

  // Run MFA verification animation
  const runMfaVerification = useCallback(async () => {
    setPhase("mfa_verifying");
    setMfaStepIdx(0);

    for (let i = 0; i < MFA_STEPS.length; i++) {
      setMfaStepIdx(i);
      const delay = 600 + Math.random() * 400;
      await new Promise((r) => setTimeout(r, delay));
    }

    // Done — redirect
    await new Promise((r) => setTimeout(r, 400));
    router.push("/");
    router.refresh();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    runVerification(username, password);
  };

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mfaCode.length !== 6 || !/^\d+$/.test(mfaCode)) {
      setError("Invalid MFA code. Enter a 6-digit code.");
      return;
    }

    setError("");
    runMfaVerification();
  };

  const resetAll = () => {
    setPhase("form");
    setStepIdx(0);
    setMfaStepIdx(0);
    setMfaCode("");
    setError("");
    setLoginFailed(false);
    setFailAtStep(-1);
    setVerifiedUser(null);
  };

  const fillDemo = (u: (typeof authUsers)[0]) => {
    setUsername(u.username);
    setPassword(u.password);
    setError("");
    if (phase !== "form") resetAll();
  };

  // ── Render helpers ──

  const renderStepIcon = (
    currentIdx: number,
    idx: number,
    failed: boolean,
    failIdx: number,
    IconComp: React.ElementType
  ) => {
    if (failed && idx === failIdx) {
      return <XCircle size={15} className="text-red-500" />;
    }
    if (idx < currentIdx || (idx === currentIdx && !failed && currentIdx === loginSteps.length - 1 && phase !== "verifying")) {
      return <CheckCircle2 size={15} className="text-emerald-500" />;
    }
    if (idx === currentIdx) {
      return (
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      );
    }
    return <Circle size={15} className="text-slate-300" />;
  };

  const renderMfaStepIcon = (currentIdx: number, idx: number, IconComp: React.ElementType) => {
    if (idx < currentIdx) {
      return <CheckCircle2 size={15} className="text-emerald-500" />;
    }
    if (idx === currentIdx) {
      return (
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      );
    }
    return <Circle size={15} className="text-slate-300" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ── Left panel — branding (desktop) ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Top */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] tracking-tight">MediTrust</p>
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">
                  Zero Trust
                </p>
              </div>
            </div>

            <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight mb-3">
              Zero Trust
              <br />
              Security Dashboard
            </h1>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[340px] mb-10">
              Implementing and evaluating Zero Trust access control for
              cloud-based Electronic Health Records using Microsoft Azure Entra ID.
            </p>

            <div className="space-y-2.5">
              {[
                { icon: UserCheck, label: "Identity verification via Microsoft Entra ID" },
                { icon: KeyRound, label: "MFA enforced through Conditional Access" },
                { icon: Shield, label: "Risk-based access policies (CA001–CA004)" },
                { icon: Lock, label: "Least-privilege RBAC across all resources" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-3.5 py-2.5"
                  >
                    <Icon size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[12px] text-slate-300">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom — Author */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 ring-2 ring-white/5 flex-shrink-0">
                <Image
                  src="/avatar.jpg"
                  alt="Adegunle Kanyinsola Olayinka"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">
                  Adegunle Kanyinsola Olayinka
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
  MIT Final Year Project
</p>
<p className="text-[10px] text-slate-600 mt-1">
  Academic Demonstration
</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center mb-4 shadow-xl">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h1 className="text-[20px] font-extrabold text-white tracking-tight">
              MediTrust Health Cloud
            </h1>
            <p className="text-[12px] text-slate-400 mt-1">
              Zero Trust Security Dashboard
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                <Image
                  src="/avatar.jpg"
                  alt="Adegunle Kanyinsola Olayinka"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">
                  Adegunle Kanyinsola Olayinka
                </p>
                <p className="text-[10px] text-slate-400">MSc Cybersecurity Researcher</p>
              </div>
            </div>
            <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
              Academic Demonstration
            </span>
          </div>

          {/* ── Login Card ── */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Top bar */}
            <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === "error" ? "bg-red-400" : "bg-emerald-400 animate-pulse"
                  }`}
                />
                <span className="text-[11px] font-semibold text-slate-300">
                  {phase === "verifying"
                    ? "Verifying..."
                    : phase === "mfa_verifying"
                    ? "MFA Verification..."
                    : phase === "error"
                    ? "Verification Failed"
                    : "Zero Trust Verification Active"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                CA001 · CA002 · CA003
              </span>
            </div>

            <div className="p-6">
              {/* ══════════ FORM PHASE ══════════ */}
              {phase === "form" && (
                <>
                  <div className="mb-5">
                    <h2 className="text-[17px] font-bold text-slate-900">
                      Sign in to your account
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-1">
                      Identity will be verified through Microsoft Entra ID
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="user@meditrust.demo"
                          required
                          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                        <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                        <p className="text-[12px] text-red-600 font-medium">{error}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                        Zero Trust Verification Pipeline
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { icon: Lock, label: "TLS" },
                          { icon: UserCheck, label: "Identity" },
                          { icon: Shield, label: "Group" },
                          { icon: AlertTriangle, label: "Risk" },
                          { icon: KeyRound, label: "Policy" },
                          { icon: ClipboardCheck, label: "RBAC" },
                          { icon: Fingerprint, label: "MFA" },
                        ].map((s) => {
                          const SIcon = s.icon;
                          return (
                            <div
                              key={s.label}
                              className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded px-2 py-1"
                            >
                              <SIcon size={10} className="text-slate-400" />
                              {s.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={14} />
                      Sign In Securely
                    </button>
                  </form>
                </>
              )}

              {/* ══════════ VERIFYING PHASE ══════════ */}
              {(phase === "verifying" || phase === "error") && (
                <div>
                  <div className="text-center mb-4">
                    <h2 className="text-[15px] font-bold text-slate-900">
                      {phase === "error"
                        ? "Verification Failed"
                        : "Zero Trust Verification"}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {phase === "error"
                        ? "One or more security checks did not pass"
                        : "Processing security checks — do not close this window"}
                    </p>
                  </div>

                  {/* Verified user card */}
                  {verifiedUser && phase !== "error" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 mb-3 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: verifiedUser.color }}
                      >
                        {verifiedUser.initials}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-800">
                          {verifiedUser.name}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                          {verifiedUser.role} · {verifiedUser.group}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                    {loginSteps.map((s, i) => {
                      const Icon = s.icon;
                      const isActive = i === stepIdx && phase === "verifying";
                      const isDone = i < stepIdx || (i === stepIdx && phase !== "verifying" && !loginFailed);
                      const isFailed = loginFailed && i === failAtStep;
                      const isPending = i > stepIdx;

                      return (
                        <div
                          key={s.id}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                            isFailed
                              ? "border-red-200 bg-red-50"
                              : isActive
                              ? "border-blue-200 bg-blue-50"
                              : isDone
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {renderStepIcon(stepIdx + (phase !== "verifying" ? 1 : 0), i, loginFailed, failAtStep, Icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon
                                size={11}
                                className={
                                  isFailed
                                    ? "text-red-400"
                                    : isActive
                                    ? "text-blue-500"
                                    : isDone
                                    ? "text-emerald-500"
                                    : "text-slate-400"
                                }
                              />
                              <p
                                className={`text-[11px] font-semibold leading-tight ${
                                  isFailed
                                    ? "text-red-700"
                                    : isActive
                                    ? "text-blue-800"
                                    : isDone
                                    ? "text-emerald-800"
                                    : "text-slate-500"
                                }`}
                              >
                                {s.label}
                              </p>
                            </div>
                            {(isActive || isDone || isFailed) && (
                              <p
                                className={`text-[10px] mt-0.5 leading-relaxed ${
                                  isFailed
                                    ? "text-red-500"
                                    : isActive
                                    ? "text-blue-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {isFailed
                                  ? "Credentials not recognised. Entra ID rejected the identity."
                                  : s.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Error state — retry button */}
                  {phase === "error" && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                        <XCircle size={13} className="text-red-500 flex-shrink-0" />
                        <p className="text-[12px] text-red-600 font-medium">{error}</p>
                      </div>
                      <button
                        onClick={resetAll}
                        className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-slate-800 transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ MFA PHASE ══════════ */}
              {phase === "mfa" && (
                <>
                  <div className="text-center mb-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <Fingerprint size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-[16px] font-bold text-slate-900">
                      Multifactor Authentication
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-1">
                      CA001 requires MFA for all EHR users
                    </p>
                  </div>

                  {verifiedUser && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 mb-3 flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-emerald-800">
                          Identity verified: {verifiedUser.name}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                          {verifiedUser.role} · {verifiedUser.group}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={12} className="text-blue-600" />
                      <p className="text-[10px] font-semibold text-blue-700">
                        {loginSteps.length} / {loginSteps.length} pre-MFA checks passed
                      </p>
                    </div>
                    <p className="text-[10px] text-blue-500 mt-1">
                      TLS · Identity · Group · CA001 · CA002 · CA003 · RBAC · Storage
                      {verifiedUser?.group === "EHR-Cloud-Admins" ||
                      verifiedUser?.group === "EHR-IT-Security"
                        ? " · CA004"
                        : ""}
                    </p>
                  </div>

                  <form onSubmit={handleMfa} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        6-Digit Authenticator Code
                      </label>
                      <input
                        type="text"
                        value={mfaCode}
                        onChange={(e) =>
                          setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoFocus
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[20px] font-mono text-slate-800 text-center tracking-[8px] placeholder:text-slate-300 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                        Demo: enter any 6 digits e.g. <strong>123456</strong>
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                        <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                        <p className="text-[12px] text-red-600 font-medium">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Fingerprint size={14} />
                      Verify MFA
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="w-full text-[12px] text-slate-400 hover:text-slate-600 py-1.5 font-medium transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </form>
                </>
              )}

              {/* ══════════ MFA VERIFYING PHASE ══════════ */}
              {phase === "mfa_verifying" && (
                <div>
                  <div className="text-center mb-4">
                    <h2 className="text-[15px] font-bold text-slate-900">
                      Completing Authentication
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Finalising Zero Trust verification pipeline
                    </p>
                  </div>

                  {verifiedUser && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 mb-3 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: verifiedUser.color }}
                      >
                        {verifiedUser.initials}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-800">
                          {verifiedUser.name}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                          {verifiedUser.role} · {verifiedUser.group}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {MFA_STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const isDone = i < mfaStepIdx;
                      const isActive = i === mfaStepIdx;
                      const isLast = i === MFA_STEPS.length - 1;

                      return (
                        <div
                          key={s.id}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                            isDone
                              ? isLast
                                ? "border-emerald-300 bg-emerald-100"
                                : "border-emerald-200 bg-emerald-50"
                              : isActive
                              ? "border-blue-200 bg-blue-50"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {renderMfaStepIcon(mfaStepIdx + 1, i, Icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon
                                size={11}
                                className={
                                  isDone
                                    ? "text-emerald-500"
                                    : isActive
                                    ? "text-blue-500"
                                    : "text-slate-400"
                                }
                              />
                              <p
                                className={`text-[11px] font-semibold leading-tight ${
                                  isDone
                                    ? "text-emerald-800"
                                    : isActive
                                    ? "text-blue-800"
                                    : "text-slate-500"
                                }`}
                              >
                                {s.label}
                              </p>
                            </div>
                            {(isActive || isDone) && (
                              <p
                                className={`text-[10px] mt-0.5 leading-relaxed ${
                                  isDone ? "text-emerald-600" : "text-blue-600"
                                }`}
                              >
                                {s.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Demo credentials — only show on form phase */}
          {(phase === "form" || phase === "error") && (
            <div className="mt-5 bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Demo Credentials — Click to fill
                </p>
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-white/5">
                {authUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => fillDemo(u)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: u.color }}
                    >
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-white truncate">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{u.username}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {u.role}
                      </span>
                      {u.status === "Restricted" && (
                        <span className="block text-[9px] text-red-400 font-semibold">
                          Restricted
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom branding */}
          <div className="mt-5 text-center">
            <p className="text-[10px] text-slate-600">Designed & Developed by</p>
            <p className="text-[12px] font-bold text-slate-400 mt-0.5">
              Adegunle Kanyinsola Olayinka
            </p>
            <p className="text-[10px] text-slate-700 mt-0.5">
              Academic demonstration only — no real patient data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
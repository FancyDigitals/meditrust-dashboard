"use client";

import { useState } from "react";
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
} from "lucide-react";
import { authUsers } from "@/lib/auth-users";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate identity + credential check
    await new Promise((r) => setTimeout(r, 900));

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Access denied.");
      setLoading(false);
      return;
    }

    // Simulate MFA step
    setLoading(false);
    setPendingUser(username);
    setMfaStep(true);
  };

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaLoading(true);

    // Simulate MFA verification (accept any 6-digit code for demo)
    await new Promise((r) => setTimeout(r, 1200));

    if (mfaCode.length !== 6 || !/^\d+$/.test(mfaCode)) {
      setError("Invalid MFA code. Enter a 6-digit code.");
      setMfaLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const fillDemo = (u: (typeof authUsers)[0]) => {
    setUsername(u.username);
    setPassword(u.password);
    setError("");
    setMfaStep(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center mb-4 shadow-xl">
            <ShieldCheck size={26} className="text-white" />
          </div>
          <h1 className="text-[22px] font-extrabold text-white tracking-tight">
            MediTrust Health Cloud
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Zero Trust Security Dashboard
          </p>
          <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
            Academic Demonstration
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Zero Trust indicator */}
          <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-300">
                Zero Trust Verification Active
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              CA001 · CA002 · CA003
            </span>
          </div>

          <div className="p-6">
            {!mfaStep ? (
              <>
                <div className="mb-5">
                  <h2 className="text-[17px] font-bold text-slate-900">
                    Sign in to your account
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-1">
                    Identity and credentials will be verified
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
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

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
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

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                      <p className="text-[12px] text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Zero Trust checks visual */}
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                      Verification Steps
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Identity", "MFA", "Risk Check"].map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Verifying identity...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        Sign In Securely
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* MFA Step */
              <>
                <div className="text-center mb-5">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <ShieldCheck size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-[16px] font-bold text-slate-900">
                    MFA Verification
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-1">
                    Conditional Access Policy CA001 requires multifactor authentication
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-4">
                  <p className="text-[11px] text-blue-700 font-medium text-center">
                    Identity verified for{" "}
                    <span className="font-bold">{pendingUser}</span>
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
                    disabled={mfaLoading}
                    className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-[13px] font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {mfaLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Verifying MFA...
                      </>
                    ) : (
                      "Verify & Enter Dashboard"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMfaStep(false);
                      setMfaCode("");
                      setError("");
                    }}
                    className="w-full text-[12px] text-slate-400 hover:text-slate-600 py-1.5 font-medium transition-colors"
                  >
                    ← Back to sign in
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Demo credentials */}
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

        <p className="text-center text-[11px] text-slate-600 mt-4">
          Academic demonstration only — no real patient data
        </p>
      </div>
    </div>
  );
}
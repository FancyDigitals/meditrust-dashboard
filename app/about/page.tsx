import { BookOpen, Shield, Cloud, Lock, Activity, Users, Key, Database } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Never Trust, Always Verify",
    dissertation:
      "Rose et al. (2020) argue that Zero Trust Architecture does not believe in implicit trust access decisions are based on continuous evaluation of identity, device, application, data, and security policy.",
    implementation:
      "Every access request in this simulation passes through identity verification, MFA, risk evaluation, role check, and permission check before a decision is made.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Users,
    title: "Identity & Authentication",
    dissertation:
      "Healthcare organisations need a security system that can manage identity, control user privileges, monitor activity, protect data, and support accountability across the entire EHR environment.",
    implementation:
      "Microsoft Entra ID manages all simulated user identities. Seven healthcare roles are assigned to security groups (EHR-Doctors, EHR-Nurses, EHR-Vendors, etc.) and MFA is enforced via Conditional Access CA001.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Key,
    title: "Least-Privilege Access",
    dissertation:
      "Cloud-based EHR systems can be accessed by different users, devices, applications, and third-party service providers. Healthcare organisations need a security system that manages user privileges across the entire EHR environment.",
    implementation:
      "Azure RBAC assigns the minimum required permissions per role. Doctors have Read/Write on patient-records. Nurses have Read only. Vendors have no access to any clinical container.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Lock,
    title: "Risk-Based Conditional Access",
    dissertation:
      "Nemec et al. (2024) elaborated that healthcare data breaches can occur through lax access control, weak authentication, malware, phishing, insider misuse, and inadequate monitoring.",
    implementation:
      "CA002 blocks high-risk sign-ins immediately. CA003 requires an additional MFA challenge for medium-risk sign-ins. CA004 enforces a separate MFA requirement for administrative roles.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Database,
    title: "Data Protection",
    dissertation:
      "EHR systems contain clinical histories, diagnoses, prescription data, laboratory test results, billing data and other forms of sensitive health information, protecting EHRs is essential for patient privacy and institutional trust.",
    implementation:
      "All three Azure storage containers (patient-records, admin-records, audit-evidence) are configured as Private with anonymous access disabled, secure transfer enforced, and TLS 1.2+ required.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Cloud,
    title: "Cloud Security Governance",
    dissertation:
      "Cresswell et al. (2022) noted that cloud adoption in healthcare brings governance, security, privacy, and implementation challenges. While cloud computing can improve healthcare efficiency, it increases the responsibility to protect sensitive patient information.",
    implementation:
      "The simulated environment uses Microsoft Azure with Entra ID, RBAC, Conditional Access, private storage, and audit logging each corresponding to a documented governance control.",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    icon: Activity,
    title: "Continuous Monitoring",
    dissertation:
      "Traditional perimeter-based security models assume inside users or devices can be trusted. This is no longer appropriate access must be continuously re-verified rather than assumed once login is successful.",
    implementation:
      "Every simulated access event is logged with the user, action, resource, risk level, and result. The Activity Logs page provides a filterable audit trail of all security decisions.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
];

const azureComponents = [
  { label: "Microsoft Entra ID",        purpose: "Identity and authentication platform" },
  { label: "Entra Security Groups",     purpose: "EHR-Doctors, EHR-Nurses, EHR-Vendors, EHR-Auditors, EHR-Cloud-Admins, EHR-IT-Security, EHR-Records-Admins" },
  { label: "Azure RBAC",                purpose: "Role-based access control least privilege per container" },
  { label: "Conditional Access CA001",  purpose: "Require MFA for all EHR user groups" },
  { label: "Conditional Access CA002",  purpose: "Block high-risk sign-ins immediately" },
  { label: "Conditional Access CA003",  purpose: "Require MFA for medium-risk sign-ins" },
  { label: "Conditional Access CA004",  purpose: "Require MFA for administrative roles" },
  { label: "Azure Blob Storage",        purpose: "Three private containers: patient-records, admin-records, audit-evidence" },
  { label: "Azure Monitor",             purpose: "Audit logging and security event monitoring" },
  { label: "MFA",                       purpose: "Multifactor authentication enforced for all EHR users" },
];

const references = [
  "Ahmed, et al. (2025). Security and privacy challenges in cloud-based EHR systems.",
  "Al-Adwani and Almotairi (2023). Healthcare data privacy and cloud security challenges.",
  "Almulihi et al. (2022). Electronic health record security and privacy in the cloud.",
  "Arega and Sharma (2023). Cloud adoption in healthcare digital transformation.",
  "Baptist et al. (2023). Cloud security complexity in modern healthcare organisations.",
  "Cresswell et al. (2022). Cloud and digital health: governance, security and implementation.",
  "HHS (2024). Ransomware and healthcare: impact on patient data and clinical services.",
  "Mohammed (2024). Cloud-based EHR systems and healthcare interoperability.",
  "Narayanasamy (2025). Cloud infrastructure for electronic health records.",
  "Nemec et al. (2024). Healthcare data breach vectors: access control and authentication failures.",
  "Olorunfemi et al. (2024). Telehealth, remote monitoring and cloud EHR systems.",
  "Oyekunle et al. (2025). Ransomware threats to cloud-based healthcare systems.",
  "Rose et al. (2020). Zero Trust Architecture. NIST Special Publication 800-207.",
  "Triplett (2024). Cloud dependence and EHR security challenges in modern healthcare.",
  "Xu (2024). Clinical analytics and digital transformation in cloud healthcare.",
];

export default function AboutPage() {
  return (
    <div className="p-5 space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">About This Project</h1>
          <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            Academic Demo
          </span>
        </div>
        <p className="text-[13px] text-slate-400">
          The research foundation and Azure implementation behind this dashboard
        </p>
      </div>

      {/* Dissertation title card */}
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Dissertation Title
            </p>
            <p className="text-[15px] font-bold leading-snug text-white mb-4">
              Implementing and Evaluating Zero Trust Access Control for Cloud-Based Electronic Health Records (EHR) Systems Using Microsoft Azure Entra ID
            </p>
            <div className="flex flex-wrap gap-3 text-[11px]">
              <span className="bg-white/10 px-2.5 py-1 rounded-full">
  Author: Adegunle Kanyinsola Olayinka
</span>
<span className="bg-white/10 px-2.5 py-1 rounded-full">
  MIT Final Year Project
</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full">
                Platform: Microsoft Azure
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Zero Trust idea */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">The Core Principle</p>
        </div>
        <div className="p-5">
          <div className="text-center py-4">
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Never Trust. Always Verify.
            </p>
            <p className="text-[13px] text-slate-500 max-w-xl mx-auto leading-relaxed">
              Traditional perimeter-based security models assume inside users can be trusted once they are on the network. 
              Zero Trust Architecture removes this assumption entirely. Every access request regardless of origin 
              must be verified against identity, MFA, risk, role, and permission before access is granted.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Identity","Authentication","MFA","Risk","Role","Resource","Permission","Monitoring"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <span className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {step}
                </span>
                {i < 7 && <span className="text-slate-300 text-sm">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seven pillars */}
      <div>
        <div className="mb-4">
          <p className="text-[15px] font-bold text-slate-900">
            Dissertation Findings vs. Implementation
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            How each research finding maps to the Azure configuration and this dashboard
          </p>
        </div>
        <div className="space-y-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${pillar.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className={pillar.color} />
                    </div>
                    <p className="text-[13px] font-bold text-slate-900">{pillar.title}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                        📄 Research Finding
                      </p>
                      <p className="text-[12px] text-slate-600 leading-relaxed">
                        {pillar.dissertation}
                      </p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">
                        ✓ Azure Implementation
                      </p>
                      <p className="text-[12px] text-emerald-800 leading-relaxed">
                        {pillar.implementation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Azure components */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">Azure Implementation Components</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Configured controls in the simulated environment</p>
        </div>
        <div className="divide-y divide-slate-100">
          {azureComponents.map((item) => (
            <div key={item.label} className="flex items-start gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[12px] font-semibold text-slate-900">{item.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What this dashboard demonstrates */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">What This Dashboard Demonstrates</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { page: "Dashboard",          demonstrates: "The full Zero Trust verification flow with interactive steps, security coverage, and live activity feed" },
              { page: "Users",              demonstrates: "Seven simulated healthcare roles with Entra ID security group assignments and MFA status" },
              { page: "Access Control",     demonstrates: "Least-privilege permission matrix across all three private Azure storage containers" },
              { page: "Security Policies",  demonstrates: "CA001–CA004 Conditional Access policies including MFA enforcement and risk-based blocking" },
              { page: "Activity Logs",      demonstrates: "Simulated audit trail of access events, denials, blocks, and MFA challenges" },
              { page: "Test Access",        demonstrates: "Live permission engine select a user, resource and action to see a real Zero Trust access decision" },
            ].map((item) => (
              <div key={item.page} className="border border-slate-200 rounded-lg p-3.5">
                <p className="text-[12px] font-bold text-slate-900 mb-1">{item.page}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.demonstrates}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-[12px] font-bold text-amber-800 mb-1">Important Note</p>
        <p className="text-[12px] text-amber-700 leading-relaxed">
          This dashboard is an academic demonstration only. No real patient data is used anywhere in this application. 
          All user accounts, records, and activity events are fully simulated for educational purposes. 
          The underlying Azure configuration uses dummy data exclusively. This project does not replace or represent 
          a real clinical EHR system.
        </p>
      </div>

      {/* References */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="text-[13px] font-semibold text-slate-900">Key References</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Selected citations from the dissertation</p>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {references.map((ref, i) => (
              <div key={i} className="flex items-start gap-3 text-[11px] text-slate-500 leading-relaxed">
                <span className="text-slate-300 font-mono flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span>{ref}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
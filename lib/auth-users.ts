export interface AuthUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  group: string;
  access: string;
  mfa: string;
  status: string;
  initials: string;
  color: string;
  permissions: string[];
}

export const authUsers: AuthUser[] = [
  {
    id: "1",
    name: "Doctor User",
    username: "dr.user@hallmark.health",
    password: "Doctor@2024",
    role: "Doctor",
    group: "EHR-Doctors",
    access: "Patient Records",
    mfa: "Required",
    status: "Protected",
    initials: "DU",
    color: "#3b82f6",
    permissions: ["dashboard", "users", "access-control", "policies", "activity", "test-access", "about"],
  },
  {
    id: "2",
    name: "Nurse User",
    username: "nurse.user@hallmark.health",
    password: "Nurse@2024",
    role: "Nurse",
    group: "EHR-Nurses",
    access: "Patient Records (Read)",
    mfa: "Required",
    status: "Protected",
    initials: "NU",
    color: "#10b981",
    permissions: ["dashboard", "users", "access-control", "policies", "activity", "test-access", "about"],
  },
  {
    id: "3",
    name: "Records Admin User",
    username: "records.admin@hallmark.health",
    password: "Records@2024",
    role: "Records Admin",
    group: "EHR-Records-Admins",
    access: "Admin Records",
    mfa: "Required",
    status: "Protected",
    initials: "RA",
    color: "#8b5cf6",
    permissions: ["dashboard", "access-control", "policies", "activity", "about"],
  },
  {
    id: "4",
    name: "IT Security Admin User",
    username: "it.security@hallmark.health",
    password: "ITSec@2024",
    role: "IT Security Admin",
    group: "EHR-IT-Security",
    access: "Monitoring / Logs",
    mfa: "Required",
    status: "Protected",
    initials: "IS",
    color: "#f59e0b",
    permissions: ["dashboard", "users", "access-control", "policies", "activity", "test-access", "about"],
  },
  {
    id: "5",
    name: "Cloud Admin User",
    username: "cloud.admin@hallmark.health",
    password: "Cloud@2024",
    role: "Cloud Admin",
    group: "EHR-Cloud-Admins",
    access: "Azure Infrastructure",
    mfa: "Required",
    status: "Protected",
    initials: "CA",
    color: "#0f172a",
    permissions: ["dashboard", "users", "access-control", "policies", "activity", "test-access", "about"],
  },
  {
    id: "6",
    name: "Vendor User",
    username: "vendor.user@hallmark.health",
    password: "Vendor@2024",
    role: "Vendor",
    group: "EHR-Vendors",
    access: "None — Restricted",
    mfa: "Required",
    status: "Restricted",
    initials: "VU",
    color: "#ef4444",
    permissions: ["dashboard", "about"],
  },
  {
    id: "7",
    name: "Auditor User",
    username: "auditor.user@hallmark.health",
    password: "Auditor@2024",
    role: "Auditor",
    group: "EHR-Auditors",
    access: "Audit Evidence",
    mfa: "Required",
    status: "Protected",
    initials: "AU",
    color: "#6366f1",
    permissions: ["dashboard", "activity", "policies", "about"],
  },
];

export function findUserByCredentials(
  username: string,
  password: string
): AuthUser | null {
  return (
    authUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    ) ?? null
  );
}
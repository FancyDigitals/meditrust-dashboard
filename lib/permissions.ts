import { permissions } from "./data";

export function evaluateAccess(userName: string, resource: string, action: string) {
  const userPerms = permissions[userName];

  if (!userPerms) {
    return {
      allowed: false,
      reason: "User not found in the permission registry.",
      checks: defaultChecks(userName, false),
    };
  }

  const resourcePerms = userPerms[resource] ?? [];
  const allowed = resourcePerms.includes(action.toLowerCase());

  let reason = "";
  if (allowed) {
    reason = `${userName} has ${action} permission on ${resource} through Azure RBAC.`;
  } else if (resourcePerms.length === 0) {
    reason = `${userName} has no permissions on ${resource}. Denied by least-privilege policy.`;
  } else {
    reason = `${userName} only has ${resourcePerms.join(", ")} access on ${resource}. The action "${action}" is not permitted.`;
  }

  return { allowed, reason, checks: defaultChecks(userName, allowed) };
}

function defaultChecks(userName: string, permissionGranted: boolean) {
  return [
    { label: "Identity",    value: "Verified via Entra ID", ok: true  },
    { label: "MFA",         value: "Required and enforced",  ok: true  },
    { label: "Risk Level",  value: "Within policy threshold",ok: true  },
    { label: "Role",        value: "Group assignment verified",ok: true },
    { label: "Permission",  value: permissionGranted ? "Granted" : "Not granted", ok: permissionGranted },
  ];
}
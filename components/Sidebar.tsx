"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Lock,
  ShieldCheck,
  Activity,
  FlaskConical,
  BookOpen,
  X,
} from "lucide-react";

// Replace the entire nav array with this
const nav = [
  {
    section: "Overview",
    items: [
      { href: "/",       label: "Dashboard", icon: LayoutDashboard },
      { href: "/about",  label: "About",     icon: BookOpen        },
    ],
  },
  {
    section: "Security",
    items: [
      { href: "/users",          label: "Users",             icon: Users       },
      { href: "/access-control", label: "Access Control",    icon: Lock        },
      { href: "/policies",       label: "Security Policies", icon: ShieldCheck },
      { href: "/activity",       label: "Activity Logs",     icon: Activity    },
    ],
  },
  {
    section: "Demonstration",
    items: [
      { href: "/test-access", label: "Test Access", icon: FlaskConical },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-56 bg-slate-900 flex flex-col z-50
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-white font-bold text-sm tracking-tight">MediTrust</p>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              Zero Trust
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-white mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {nav.map((section) => (
            <div key={section.section} className="mb-2">
              <p className="px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {section.section}
              </p>
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-2.5 px-5 py-2 text-[13px] font-medium transition-colors
                      ${active
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <Icon size={14} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500">Academic Demonstration</p>
          <p className="text-[10px] text-slate-700 mt-1 leading-relaxed">
            No real patient data is used
          </p>
        </div>
      </aside>
    </>
  );
}
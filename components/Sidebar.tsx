"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PhoneCall,
  Scissors,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: CalendarDays },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Follow-ups", href: "/follow-ups", icon: PhoneCall },
  { name: "Services", href: "/services", icon: Scissors }, // ✅ FIXED
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on public pages
  if (pathname === "/login" || pathname.startsWith("/book/")) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="h-screen w-64 flex flex-col border-r bg-white/80 backdrop-blur-xl px-4 py-6">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
          <Scissors className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black leading-none">SalonDash</h2>
          <p className="text-xs text-slate-400">Business Suite</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/" && item.href === "/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon
                className={`w-4 h-4 transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto space-y-3">

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {/* FOOTER */}
        <div className="text-[11px] text-slate-400 text-center">
          © 2026 SalonDash
        </div>
      </div>
    </div>
  );
}
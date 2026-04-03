"use client";

import React from "react";
import { Bell, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function TopNav() {
  const pathname = usePathname();
  const { userData } = useAuth();

  // ❌ Hide on login & public booking
  if (pathname === "/login" || pathname.startsWith("/book/")) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="flex h-16 items-center border-b bg-white px-6 w-full shrink-0">
      
      {/* Title */}
      <h1 className="text-xl font-semibold text-slate-900">
        Salon Dashboard
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">

        {/* 🔔 Notification */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* 👤 Profile */}
        <div className="flex items-center gap-3 ml-2 border-l pl-4">

          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-slate-900">
              {userData?.name || "Owner"}
            </span>

            {/* ✅ FIXED (no slug) */}
            <span className="text-xs text-slate-500 mt-1">
              salon/demo
            </span>
          </div>

          {/* Avatar */}
          <button className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
            {userData?.name ? (
              userData.name.charAt(0).toUpperCase()
            ) : (
              <UserCircle className="h-5 w-5" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
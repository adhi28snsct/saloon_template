"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrGetUser } from "@/lib/user"; // optional (can keep)
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

import { Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  /* ================= BLOCK LOGIN PAGE ================= */

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  /* ================= GOOGLE LOGIN ================= */

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // ✅ Optional: keep user creation
      await createOrGetUser(loggedInUser);

      // ❌ Removed createBusiness()

      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center space-y-8"
      >
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-full">
          <Scissors className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Booking System
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your appointments easily.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full h-12 text-base font-medium"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        <p className="text-xs text-slate-400 text-center w-full mt-4">
          Simple booking system for your business.
        </p>
      </motion.div>
    </div>
  );
}
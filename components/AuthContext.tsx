"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";

/* ================= TYPES ================= */

type UserData = {
  uid: string;
  name?: string;
  email?: string;

  // ✅ Business info stored in same doc
  description?: string;
  phone?: string;
  address?: string;
  coverImage?: string;

  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        } else {
          // ✅ fallback if user doc not created
          setUserData({
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= ROUTE GUARD ================= */

  useEffect(() => {
    if (loading) return;

   const isPublic =
  pathname === "/" || // ✅ ADD THIS
  pathname.startsWith("/login") ||
  pathname.startsWith("/book");

    if (!user && !isPublic) {
      router.replace("/login");
    }

    if (user && pathname.startsWith("/login")) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
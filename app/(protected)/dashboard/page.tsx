"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

import DashboardUI from "@/components/Dashboard";
import ProfileModal from "@/components/ProfileModal";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
  Search,
  Plus,
  Bell
} from "lucide-react";

export default function DashboardPage() {
  const { user, userData } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [followUpsCount, setFollowUpsCount] = useState(0);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubApt = onSnapshot(
      query(collection(db, "appointments"), orderBy("createdAt", "desc")),
      (snap) => {
        const data: any[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setAppointments(data);
        setLoading(false);
      }
    );

    const unsubCust = onSnapshot(collection(db, "customers"), (snap) => {
      setCustomersCount(snap.size);
    });

    const unsubFollow = onSnapshot(
      query(collection(db, "followUps"), where("status", "==", "Pending")),
      (snap) => setFollowUpsCount(snap.size)
    );

    return () => { unsubApt(); unsubCust(); unsubFollow(); };
  }, [user]);

  const filteredAppointments = appointments.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.serviceName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filteredAppointments.reduce((sum, apt) => {
    const amount = parseInt(String(apt.price || "0").replace(/[^0-9]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const todayStr = new Date().toLocaleDateString("en-CA");
  const todaysAppointments = filteredAppointments.filter((a) => {
    const dateVal = a.date?.seconds
      ? new Date(a.date.seconds * 1000).toLocaleDateString("en-CA")
      : a.date;
    return dateVal === todayStr;
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-black">
              👋 Welcome, {userData?.name || "Partner"}
            </h1>
            <p className="text-sm text-slate-400">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <Button variant="ghost" className="rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => setProfileOpen(true)}
              className="rounded-xl"
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 space-y-8">

        {/* STATS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <StatCard label="Revenue" value={`₹${totalRevenue}`} icon={<TrendingUp />} highlight />
          <StatCard label="Bookings" value={filteredAppointments.length} icon={<CalendarIcon />} />
          <StatCard label="Customers" value={customersCount} icon={<Users />} />
          <StatCard label="Today" value={todaysAppointments.length} icon={<Activity />} />
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="flex gap-4">
          <Button className="rounded-xl shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
          <Button variant="outline" className="rounded-xl">
            Add Customer
          </Button>
        </div>

        {/* MAIN PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border p-4"
        >
          <DashboardUI
            totalRevenue={totalRevenue}
            appointments={filteredAppointments}
            customersCount={customersCount}
            followUpsCount={followUpsCount}
            todaysAppointments={todaysAppointments}
            search={search}
            setSearch={setSearch}
          />
        </motion.div>

      </main>

      <ProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        business={{
          name: userData?.name || "Business Name",
          description: userData?.description || "",
          phone: userData?.phone || "",
          address: userData?.address || "",
          coverImage: userData?.coverImage || "",
        }}
      />
    </div>
  );
}

/* STAT CARD */

function StatCard({ label, value, icon, highlight }: any) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-5 rounded-2xl transition-all ${
        highlight
          ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg"
          : "bg-white border"
      }`}
    >
      <div className="flex justify-between mb-3">
        <div className="opacity-80">{icon}</div>
        <span className="text-xs font-bold opacity-70">+12%</span>
      </div>

      <p className="text-xs uppercase opacity-70">{label}</p>
      <h2 className="text-2xl font-black">{value}</h2>
    </motion.div>
  );
}
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Phone,
  MessageSquare,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import AddModal from "@/components/AddModal";

/* ================= TYPE ================= */

interface FollowUp {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  action: string;
  status: string;
  createdAt: string;
  isDueToday: boolean;
  isOverdue: boolean;
}

/* ================= PAGE ================= */

export default function FollowUpsPage() {
  const [search, setSearch] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "followUps"),
      (snapshot) => {
        const today = new Date().toISOString().split("T")[0];

        const data = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();

          return {
            id: docSnap.id,
            ...d,
            isDueToday: d.date === today,
            isOverdue: d.date < today,
          } as FollowUp;
        });

        data.sort((a, b) => {
          if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
          if (a.isDueToday !== b.isDueToday) return a.isDueToday ? -1 : 1;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setFollowUps(data.filter((f) => f.status === "Pending"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return followUps.filter(
      (f) =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.phone?.includes(search)
    );
  }, [followUps, search]);

  const handleComplete = async (id: string) => {
    await updateDoc(doc(db, "followUps", id), {
      status: "Completed",
    });
  };

  const overdueCount = followUps.filter((f) => f.isOverdue).length;
  const todayCount = followUps.filter((f) => f.isDueToday).length;

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black">Follow Ups</h1>
          <p className="text-sm text-slate-400">
            Manage and track your customer outreach
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400" />
            <input
              placeholder="Search follow-ups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* ADD */}
          <AddModal
            title="Add Follow Up"
            triggerText={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </div>
            }
            fields={[
              { name: "name", label: "Client Name", placeholder: "Enter name" },
              { name: "phone", label: "Phone", placeholder: "Enter phone" },
              { name: "service", label: "Service", placeholder: "Haircut" },
              { name: "date", label: "Date", placeholder: "YYYY-MM-DD" },
              { name: "action", label: "Action", placeholder: "Call / Offer" },
            ]}
            onSubmit={async (data) => {
              await addDoc(collection(db, "followUps"), {
                ...data,
                status: "Pending",
                createdAt: new Date().toISOString(),
              });
            }}
          />
        </div>
      </div>

      {/* STATS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          label="Total Pending"
          value={followUps.length}
          icon={<Clock />}
        />

        <StatCard
          label="Due Today"
          value={todayCount}
          icon={<CheckCircle2 />}
        />

        <StatCard
          label="Overdue"
          value={overdueCount}
          icon={<AlertCircle />}
          highlight
        />
      </motion.div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400">No follow-ups</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-4"
        >
          <AnimatePresence>
            {filtered.map((item) => (
              <FollowUpCard
                key={item.id}
                item={item}
                onComplete={handleComplete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value, icon, highlight }: any) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-5 rounded-2xl transition-all ${
        highlight
          ? "bg-gradient-to-br from-red-500 to-red-400 text-white shadow-lg"
          : "bg-white border shadow-sm"
      }`}
    >
      <div className="flex justify-between mb-3">
        <div className="opacity-80">{icon}</div>
      </div>

      <p className="text-xs uppercase opacity-70">{label}</p>
      <h2 className="text-2xl font-black">{value}</h2>
    </motion.div>
  );
}

/* ================= CARD ================= */

function FollowUpCard({
  item,
  onComplete,
}: {
  item: FollowUp;
  onComplete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className={`flex justify-between items-center p-5 rounded-2xl border shadow-sm transition ${
        item.isOverdue
          ? "bg-red-50 border-red-200"
          : item.isDueToday
          ? "bg-yellow-50 border-yellow-200"
          : "bg-white"
      }`}
    >
      <div>
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-slate-400">
          {item.phone} • {item.service}
        </p>

        <p className="text-xs mt-1 text-slate-500">
          {item.isOverdue
            ? "Overdue"
            : item.isDueToday
            ? "Due Today"
            : item.date}
        </p>
      </div>

      <div className="flex gap-2">
        <a href={`tel:${item.phone}`}>
          <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
            <Phone className="w-4 h-4" />
          </button>
        </a>

        <a
          href={`https://wa.me/${item.phone}`}
          target="_blank"
          rel="noreferrer"
        >
          <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
            <MessageSquare className="w-4 h-4" />
          </button>
        </a>

        <button
          onClick={() => onComplete(item.id)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:opacity-90"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}
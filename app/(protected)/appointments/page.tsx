"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "@/components/AddModal";
import { useAuth } from "@/components/AuthContext";
import {
  subscribeAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "@/lib/appointment";

export default function AppointmentsPage() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeAppointments((data) => {
      setAppointments(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const handleStatusChange = async (apt: any, newStatus: string) => {
    if (actionLoading[apt.id]) return;

    setActionLoading((prev) => ({ ...prev, [apt.id]: true }));

    try {
      await updateAppointmentStatus(apt, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [apt.id]: false }));
    }
  };

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchSearch = apt.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchTab =
        activeTab === "ALL" || apt.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [appointments, search, activeTab]);

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">

      {/* HEADER (MATCH DASHBOARD STYLE) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black">Appointments</h1>
          <p className="text-sm text-slate-400">
            Manage and track your bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400" />
            <input
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <AddModal
            title="Create Booking"
            triggerText={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Booking
              </div>
            }
            fields={[
              { name: "name", label: "Client Name", placeholder: "Enter client name" },
              { name: "phone", label: "Phone", placeholder: "Enter phone number" },
              { name: "serviceId", label: "Service", placeholder: "Select service" },
              { name: "date", label: "Date", placeholder: "YYYY-MM-DD" },
              { name: "time", label: "Time", placeholder: "HH:MM" },
              { name: "duration", label: "Duration", placeholder: "In minutes" },
              { name: "price", label: "Price", placeholder: "Enter amount" },
            ]}
            onSubmit={async (data) => {
              await createAppointment(data);
            }}
          />
        </div>
      </div>

      {/* TABS (UPGRADED) */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "BOOKED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-white border text-slate-500 hover:bg-slate-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400">No appointments</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          className="grid gap-4"
        >
          <AnimatePresence>
            {filtered.map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                isLoading={actionLoading[apt.id]}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* CARD (PREMIUM STYLE) */

function AppointmentCard({ apt, isLoading, onStatusChange }: any) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition"
    >
      <div>
        <h3 className="font-semibold text-lg">{apt.name}</h3>
        <p className="text-sm text-slate-400">
          {apt.phone} • {apt.date} • {apt.startTime}
        </p>
        <p className="font-bold text-indigo-600 mt-1">
          ₹{apt.price}
        </p>
      </div>

      <div className="flex gap-2">
        {apt.status === "BOOKED" && (
          <Button onClick={() => onStatusChange(apt, "ACCEPTED")}>
            Accept
          </Button>
        )}

        {apt.status === "ACCEPTED" && (
          <Button onClick={() => onStatusChange(apt, "COMPLETED")}>
            Done
          </Button>
        )}

        {apt.status !== "COMPLETED" && (
          <Button
            variant="destructive"
            onClick={() => onStatusChange(apt, "CANCELLED")}
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.div>
  );
}
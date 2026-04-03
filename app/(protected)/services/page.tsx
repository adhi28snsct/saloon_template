"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Scissors, Clock } from "lucide-react";

/* ================= PAGE ================= */

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snap) => {
        const data: any[] = [];
        snap.forEach((docItem) =>
          data.push({ id: docItem.id, ...docItem.data() })
        );

        setServices(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ================= FILTER ================= */

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= ADD ================= */

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.duration) return;

    await addDoc(collection(db, "services"), {
      name: form.name,
      price: Number(form.price),
      duration: Number(form.duration),
      isActive: true,
      createdAt: new Date(),
    });

    setForm({ name: "", price: "", duration: "" });
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "services", id));
  };

  /* ================= CALC ================= */

  const avgPrice =
    services.length > 0
      ? Math.round(
          services.reduce((sum, s) => sum + (s.price || 0), 0) /
            services.length
        )
      : 0;

  /* ================= UI ================= */

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black">Services</h1>
          <p className="text-sm text-slate-400">
            Manage your salon offerings
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400" />
          <input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:ring-2 focus:ring-indigo-200 outline-none"
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
        <StatCard label="Total Services" value={services.length} icon={<Scissors />} />
        <StatCard label="Average Price" value={`₹${avgPrice}`} icon={<Clock />} highlight />
        <StatCard
          label="Active Services"
          value={services.filter((s) => s.isActive).length}
          icon={<Scissors />}
        />
      </motion.div>

      {/* ADD FORM (UPGRADED) */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm max-w-xl">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Service
        </h2>

        <div className="grid gap-3">
          <Input
            placeholder="Service Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            placeholder="Price (₹)"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <Input
            placeholder="Duration (minutes)"
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          <Button
            onClick={handleAdd}
            className="rounded-xl mt-2"
          >
            Add Service
          </Button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400">
          No services found
        </p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid md:grid-cols-2 gap-4"
        >
          <AnimatePresence>
            {filtered.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                onDelete={handleDelete}
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
          ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg"
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

function ServiceCard({ service, onDelete }: any) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className="p-5 border rounded-2xl bg-white shadow-sm hover:shadow-md transition flex justify-between items-center"
    >
      <div>
        <h3 className="font-semibold text-lg">{service.name}</h3>
        <p className="text-sm text-slate-400">
          ₹{service.price} • {service.duration} mins
        </p>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(service.id)}
      >
        Delete
      </Button>
    </motion.div>
  );
}
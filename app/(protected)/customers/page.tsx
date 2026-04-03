"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Users, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "@/components/AddModal";
import { subscribeCustomers, createCustomer } from "@/lib/customers";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCustomers((data) => {
      setCustomers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );
  }, [customers, search]);

  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">

      {/* HEADER (MATCH DASHBOARD) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black">Customers</h1>
          <p className="text-sm text-slate-400">
            Manage and track your clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400" />
            <input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* ADD */}
          <AddModal
            title="Add Customer"
            triggerText={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Customer
              </div>
            }
            fields={[
              { name: "name", label: "Name", placeholder: "Enter name" },
              { name: "phone", label: "Phone", placeholder: "Enter phone" },
              { name: "notes", label: "Notes", placeholder: "Optional notes" },
            ]}
            onSubmit={async (data) => {
              await createCustomer(data);
            }}
          />
        </div>
      </div>

      {/* STATS (MATCH DASHBOARD STYLE) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <StatCard
          label="Total Customers"
          value={customers.length}
          icon={<Users />}
        />

        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={<TrendingUp />}
          highlight
        />
      </motion.div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400">No customers found</p>
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
            {filtered.map((c) => (
              <CustomerCard key={c.id} customer={c} />
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

/* ================= CUSTOMER CARD ================= */

function CustomerCard({ customer }: any) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition"
    >
      <div>
        <h3 className="font-semibold text-lg">{customer.name}</h3>
        <p className="text-sm text-slate-400">{customer.phone}</p>

        <div className="flex gap-4 mt-2 text-sm text-slate-500">
          <span>Visits: {customer.totalVisits || 0}</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-slate-400">Revenue</p>
        <p className="font-bold text-indigo-600 text-lg">
          ₹{customer.totalSpent || 0}
        </p>
      </div>
    </motion.div>
  );
}
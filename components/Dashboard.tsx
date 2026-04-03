"use client";

import {
  TrendingUp,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
} from "lucide-react";

/* ================= COMPONENT ================= */

export default function DashboardUI({
  totalRevenue,
  appointments,
  customersCount,
  followUpsCount,
  todaysAppointments,
}: any) {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Monitor your business performance
          </p>
        </div>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
          + New Appointment
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          label="Revenue"
          value={`₹${totalRevenue}`}
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          label="Bookings"
          value={appointments.length}
          icon={Calendar}
          color="indigo"
        />

        <StatCard
          label="Clients"
          value={customersCount}
          icon={Users}
          color="orange"
        />

        <StatCard
          label="Follow-ups"
          value={followUpsCount}
          icon={Clock}
          color="purple"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            Today's Appointments
          </h3>
          <MoreHorizontal className="text-gray-400" />
        </div>

        {todaysAppointments.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No appointments today
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-xs text-gray-400 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-xs text-gray-400 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-xs text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs text-gray-400 uppercase text-right">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {todaysAppointments.map((appt: any) => (
                  <tr key={appt.id} className="hover:bg-gray-50">

                    {/* CLIENT */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {appt.name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm">
                        {appt.name}
                      </span>
                    </td>

                    {/* SERVICE */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {appt.serviceName || "-"}
                    </td>

                    {/* TIME */}
                    <td className="px-6 py-4 text-sm font-medium">
                      {appt.startTime || "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          appt.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-600"
                            : appt.status === "ACCEPTED"
                            ? "bg-indigo-50 text-indigo-600"
                            : appt.status === "CANCELLED"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 text-right font-bold">
                      ₹{appt.price || 0}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value, icon: Icon, color }: any) {
  const styles: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-lg ${styles[color]}`}>
          <Icon size={18} />
        </div>

        <span className="text-xs text-gray-400">
          Live
        </span>
      </div>

      <p className="text-gray-400 text-xs uppercase">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}
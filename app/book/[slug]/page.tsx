"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

/* ================= PAGE ================= */

export default function BookingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {
    const fetchServices = async () => {
      const snap = await getDocs(collection(db, "services"));

      const data: any[] = [];
      snap.forEach((docItem) =>
        data.push({ id: docItem.id, ...docItem.data() })
      );

      setServices(data);
      setLoading(false);
    };

    fetchServices();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    setSubmitting(true);

    try {
      const startTime = formData.time;
      const duration = selectedService.duration || 30;

      const endTime = calculateEndTime(startTime, duration);

      // 🔥 Double booking check
      const conflictQuery = query(
        collection(db, "appointments"),
        where("date", "==", formData.date),
        where("startTime", "==", startTime)
      );

      const conflictSnap = await getDocs(conflictQuery);

      if (!conflictSnap.empty) {
        alert("This slot is already booked");
        setSubmitting(false);
        return;
      }

      // 🔥 Save booking
      await addDoc(collection(db, "appointments"), {
        name: formData.name,
        phone: formData.phone,

        serviceName: selectedService.name,
        serviceId: selectedService.id,

        date: formData.date,
        startTime,
        endTime,
        duration,

        price: selectedService.price || 0,

        status: "BOOKED",
        source: "website",

        createdAt: new Date(),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= HELPERS ================= */

  function calculateEndTime(start: string, duration: number) {
    const [h, m] = start.split(":").map(Number);
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m + duration);
    return d.toTimeString().slice(0, 5);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= SUCCESS ================= */

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
          <h2 className="text-xl font-bold">
            Booking Confirmed!
          </h2>
          <p>{selectedService?.name}</p>
          <p>{formData.date}</p>
          <p>{formData.time}</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-bold mb-4 text-center">
          Book Appointment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <Input
            required
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Phone */}
          <Input
            required
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Services */}
          <div>
            <p className="text-sm font-medium mb-2">
              Select Service
            </p>

            <div className="grid grid-cols-2 gap-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedService?.id === s.id
                      ? "border-indigo-600 bg-indigo-50"
                      : ""
                  }`}
                >
                  <p>{s.name}</p>
                  <p className="text-xs">
                    {s.duration} mins
                  </p>
                  <p className="text-sm font-semibold">
                    ₹{s.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Date */}
          <Input
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          {/* Time */}
          <Input
            required
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />

          {/* Submit */}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateTimeSlots } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BookingModal({
  open,
  onOpenChange,
  service,
}: any) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const allSlots = generateTimeSlots("10:00", "20:00", 30);
  const today = new Date().toISOString().split("T")[0];

  /* ================= RESET ================= */

  useEffect(() => {
    if (!open) {
      setForm({ name: "", phone: "", date: "" });
      setSelectedSlot(null);
      setBookedSlots([]);
      setSuccess(false);
    }
  }, [open]);

  /* ================= FETCH SLOTS ================= */

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!form.date) {
        setBookedSlots([]);
        return;
      }

      setIsLoadingSlots(true);

      try {
        const q = query(
          collection(db, "appointments"),
          where("date", "==", form.date)
        );

        const snap = await getDocs(q);

        const booked = snap.docs.map((doc) => doc.data().startTime);
        setBookedSlots(Array.from(new Set(booked)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
    setSelectedSlot(null);
  }, [form.date]);

  if (!open || !service) return null;

  /* ================= HELPERS ================= */

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(":").map(Number);
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m + duration);
    return d.toTimeString().slice(0, 5);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !selectedSlot) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const startTime = selectedSlot;
      const duration = service.duration || 30;
      const endTime = calculateEndTime(startTime, duration);

      // 🔥 Conflict check
      const q = query(
        collection(db, "appointments"),
        where("date", "==", form.date),
        where("startTime", "==", startTime)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("Slot already booked");
        setLoading(false);
        return;
      }

      // 🔥 Save booking
      await addDoc(collection(db, "appointments"), {
        name: form.name,
        phone: form.phone,

        serviceId: service.id,
        serviceName: service.name,

        date: form.date,
        startTime,
        endTime,
        duration,
        price: service.price || 0,

        status: "BOOKED",
        source: "website",

        createdAt: new Date(),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS ================= */

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl text-center space-y-3">
          <h2 className="text-green-600 font-bold text-lg">
            Booking Confirmed 🎉
          </h2>
          <p>{service.name}</p>
          <p>{form.date}</p>
          <p>{selectedSlot}</p>

          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  const bookedSet = new Set(bookedSlots);
  const allBooked =
    form.date && allSlots.every((slot) => bookedSet.has(slot));

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white p-6 rounded-xl w-full max-w-md">

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">
          Book {service.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input name="name" value={form.name} placeholder="Name" onChange={handleChange} />
          <Input name="phone" value={form.phone} placeholder="Phone" onChange={handleChange} />
          <Input type="date" name="date" value={form.date} min={today} onChange={handleChange} />

          {/* Slots */}
          {form.date && (
            <div className="grid grid-cols-3 gap-2">
              {allSlots.map((slot) => {
                const isBooked = bookedSet.has(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 border rounded ${
                      isBooked
                        ? "bg-gray-200"
                        : selectedSlot === slot
                        ? "bg-indigo-600 text-white"
                        : ""
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          <Button type="submit" className="w-full">
            Confirm Booking
          </Button>
        </form>
      </div>
    </div>
  );
}
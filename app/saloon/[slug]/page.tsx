"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import BookingModal from "@/components/BookingModal";
import { Scissors } from "lucide-react";

/* ================= CONFIG ================= */

const BUSINESS = {
  name: "Elite Studio",
  description:
    "Precision styling and premium grooming tailored for the modern individual.",
  phone: "+91 98765 43210",
  address: "Race Course, Coimbatore, Tamil Nadu",
  coverImage:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600",
};

export default function PublicSalonPage() {
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 PARALLAX STATE
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        const data: any[] = [];
        snap.forEach((docItem) =>
          data.push({ id: docItem.id, ...docItem.data() })
        );
        setServices(data);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("hair"))
      return "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600";
    if (n.includes("beard"))
      return "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600";
    if (n.includes("facial"))
      return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600";
    return "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ================= NAV ================= */}
      <nav className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4">
        <div className="w-full max-w-5xl flex justify-between items-center bg-white/90 backdrop-blur-md border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">
              {BUSINESS.name}
            </span>
          </div>

          <button
            onClick={() =>
              window.scrollTo({ top: 800, behavior: "smooth" })
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Book
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">

        {/* 🔥 FIXED PARALLAX */}
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${BUSINESS.coverImage})`,
            transform: `translateY(${scrollY * 0.6}px) scale(1.15)`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        {/* 🔥 HERO ANIMATION */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-5xl mx-auto px-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Look sharp. <br />
            Book instantly.
          </h1>

          <p className="text-gray-300 mb-8 max-w-md">
            {BUSINESS.description}
          </p>

          <button
            onClick={() =>
              window.scrollTo({ top: 900, behavior: "smooth" })
            }
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            Book Appointment
          </button>
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-10"
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition"
            >
              <img
                src={service.imageUrl || getServiceImage(service.name)}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {service.duration} mins
                </p>

                <p className="font-bold mb-3">
                  ₹{service.price}
                </p>

                <button
                  onClick={() => {
                    setSelectedService(service);
                    setOpen(true);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-10 text-center text-sm text-gray-500">
        {BUSINESS.name} • {BUSINESS.phone}
      </footer>

      {/* ================= MODAL ================= */}
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        service={selectedService}
      />
    </div>
  );
}
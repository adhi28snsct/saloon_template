"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/components/AuthContext";
import { Clock, MapPin, Phone, Star, ShieldCheck, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { userData } = useAuth();

  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        const data: any[] = [];
        snap.forEach((docItem) => data.push({ id: docItem.id, ...docItem.data() }));
        setServices(data);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      
      {/* --- 1. MINIMAL NAV --- */}
      <nav className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4">
        <div className="w-full max-w-5xl flex justify-between items-center bg-white/80 backdrop-blur-md border border-slate-200/60 px-5 py-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {userData?.name?.[0] || "S"}
            </div>
            <span className="font-semibold tracking-tight text-slate-800">
              {userData?.name || "SmartSalon"}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push("/login")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Admin
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
              className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. SAAS HERO SECTION --- */}
      <section className="relative pt-44 pb-20 px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            {/* Trust Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-6">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white" />
                ))}
              </div>
              <span className="text-[12px] font-medium text-slate-600">
                Joined by 1,200+ local clients
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Premium grooming <br /> 
              <span className="text-slate-400 font-medium">simplified for you.</span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-8 max-w-md leading-relaxed">
              {userData?.description || "Experience top-tier styling and care. Seamlessly book your next visit in seconds."}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 750, behavior: "smooth" })}
                className="bg-slate-900 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                View Services
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 px-4">
                <div className="flex text-amber-400"><Star className="w-4 h-4 fill-current" /></div>
                <span className="text-sm font-bold text-slate-700">4.9/5</span>
                <span className="text-sm text-slate-400">Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Minimalistic Framing */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-100/50 rounded-[2rem] -z-10 transition-transform group-hover:scale-105" />
            <div className="aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={userData?.coverImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"} 
                className="w-full h-full object-cover"
                alt="Salon Interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. SERVICES GRID --- */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Our Menu</h2>
          <p className="text-slate-500 font-medium">Transparent pricing. Exceptional results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-slate-200 rounded-2xl p-0 transition-all duration-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 flex flex-col"
            >
              <div className="h-56 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600"}
                  className="w-full h-full object-cover"
                  alt={service.name}
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                  <div className="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">{service.duration}m</span>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {service.description || "Tailored professional service using premium industry-standard products."}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-slate-900">₹{service.price}</span>
                  <button
                    onClick={() => { setSelectedService(service); setOpen(true); }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all text-sm"
                  >
                    Select Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. CLEAN FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">S</div>
                <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">
                  {userData?.name || "Smart Salon"}
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                Elevating the standard of local grooming through technology and expert craftsmanship.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect</h4>
              <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">{userData?.phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm font-medium leading-tight">
                  {userData?.address || "Coimbatore, Tamil Nadu"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trust</h4>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">Verified Merchant</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">Secure bookings powered by SmartSalon SaaS.</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 {userData?.name || "SmartSalon"}. All rights reserved.</p>
            <div className="flex gap-6 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">Terms</span>
              <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL --- */}
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        service={selectedService}
      />
    </div>
  );
}
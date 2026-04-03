import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { upsertCustomerFromAppointment } from "./customers";

/* ================= SUBSCRIBE ================= */

export function subscribeAppointments(
  callback: (data: any[]) => void
) {
  return onSnapshot(collection(db, "appointments"), (snapshot) => {
    const data: any[] = [];

    snapshot.forEach((docItem) => {
      data.push({ id: docItem.id, ...docItem.data() });
    });

    // Sort latest first
    data.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    callback(data);
  });
}

/* ================= CREATE ================= */

export async function createAppointment(payload: any) {
  const startTime = payload.time;
  const duration = Number(payload.duration || 30);

  const [h, m] = startTime.split(":").map(Number);

  const endDate = new Date();
  endDate.setHours(h);
  endDate.setMinutes(m + duration);

  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;

  await addDoc(collection(db, "appointments"), {
    name: payload.name,
    phone: payload.phone,
    serviceId: payload.serviceId || "",
    date: payload.date,
    startTime,
    endTime,
    status: "BOOKED",
    price: Number(payload.price || 0),
    createdAt: new Date().toISOString(),
  });
}

/* ================= UPDATE STATUS ================= */

export async function updateAppointmentStatus(
  appointment: any,
  newStatus: string
) {
  // Create customer when accepted
  if (appointment.status !== "ACCEPTED" && newStatus === "ACCEPTED") {
    await upsertCustomerFromAppointment(appointment);
  }

  const ref = doc(db, "appointments", appointment.id);

  await updateDoc(ref, {
    status: newStatus,
  });
}
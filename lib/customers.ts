import {
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= SUBSCRIBE ================= */

export function subscribeCustomers(callback: (data: any[]) => void) {
  return onSnapshot(collection(db, "customers"), (snapshot) => {
    const data: any[] = [];

    snapshot.forEach((docItem) => {
      data.push({ id: docItem.id, ...docItem.data() });
    });

    // Sort latest first
    data.sort(
      (a, b) =>
        new Date(b.createdAt?.seconds * 1000 || 0).getTime() -
        new Date(a.createdAt?.seconds * 1000 || 0).getTime()
    );

    callback(data);
  });
}

/* ================= CREATE CUSTOMER ================= */

export async function createCustomer(data: any) {
  await addDoc(collection(db, "customers"), {
    name: data.name,
    phone: data.phone,
    notes: data.notes || "",

    lastVisit: null,
    totalVisits: 0,
    totalSpent: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/* ================= UPSERT FROM APPOINTMENT ================= */

export async function upsertCustomerFromAppointment(data: any) {
  if (!data.phone) return;

  const customersRef = collection(db, "customers");

  // 🔍 Check existing customer by phone
  const q = query(customersRef, where("phone", "==", data.phone));
  const snap = await getDocs(q);

  // ✅ EXISTING CUSTOMER → update
  if (!snap.empty) {
    const existingDoc = snap.docs[0];

    await updateDoc(doc(db, "customers", existingDoc.id), {
      lastVisit: serverTimestamp(),
      totalVisits: increment(1),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  // ✅ NEW CUSTOMER → create
  await addDoc(customersRef, {
    name: data.name,
    phone: data.phone,
    notes: "Added via appointment",

    lastVisit: serverTimestamp(),
    totalVisits: 1,
    totalSpent: Number(data.price || 0),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
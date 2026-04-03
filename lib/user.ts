import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= CREATE OR GET USER ================= */

export async function createOrGetUser(user: any) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // ✅ If already exists
  if (userSnap.exists()) {
    return { isNewUser: false };
  }

  // ✅ Create new user (Single System)
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "Owner",
    email: user.email || "",

    // 🔥 Business Profile (stored in user itself)
    description: "",
    phone: "",
    address: "",
    coverImage: "",

    createdAt: new Date().toISOString(),
  });

  return { isNewUser: true };
}
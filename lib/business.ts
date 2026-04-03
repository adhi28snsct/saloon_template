import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= CREATE / GET USER ================= */

export async function createOrGetUser(user: any) {
  const userRef = doc(db, "users", user.uid);

  const snap = await getDoc(userRef);

  // ✅ If already exists → return
  if (snap.exists()) {
    return { isNewUser: false };
  }

  // ✅ Create new user profile (single system)
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",

    // 🔥 Business Profile (stored in user)
    description: "",
    phone: "",
    address: "",
    coverImage: "",

    createdAt: new Date().toISOString(),
  });

  return { isNewUser: true };
}
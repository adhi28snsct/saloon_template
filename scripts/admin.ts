import * as admin from "firebase-admin";

const serviceAccount = require("../serviceAccountKey.json"); // download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function bootstrapAdmin() {
  try {
    console.log("🚀 Starting Admin Bootstrap...");

    // 🔐 Create Admin User in Firebase Auth
    const user = await admin.auth().createUser({
      email: "admin@salondash.com",
      password: "admin123", // change later
      displayName: "Salon Admin",
    });

    console.log("✅ Auth user created:", user.uid);

    // 🧠 Generate slug
    const slug = "demo-salon";

    // 📦 Create user in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      name: "Demo Salon",
      email: user.email,
      slug: slug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Firestore user created");

    // 📅 Create sample appointment
    await db.collection("appointments").add({
      name: "Test Customer",
      phone: "9876543210",
      service: "Haircut",
      datetime: new Date(),
      status: "Booked",
      userId: user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Sample appointment added");

    console.log("🎉 Admin bootstrap completed!");
    console.log(`👉 Booking link: /book/${slug}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

bootstrapAdmin();
# ⚙️ Setup Guide – Salon Booking & Management System

Follow these steps to run the project locally.

---

## 📦 1. Extract the Project

Unzip the downloaded file and open the project folder.

---

## 🛠 2. Install Dependencies

Open terminal inside the project folder and run:

```bash
npm install
```

---

## 🔐 3. Setup Firebase Configuration

Create a file named:

```
.env.local
```

Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

👉 You can get these from your Firebase project settings.

---

## ▶️ 4. Run the Project

Start the development server:

```bash
npm run dev
```

---

## 🌐 5. Open in Browser

Go to:

```
http://localhost:3000
```

---

## 🧪 6. Test the App

* Visit public booking page:
  `/salon/demo`

* Open dashboard (if implemented):
  `/dashboard`

---

## ⚠️ Notes

* Make sure Firebase is properly configured
* Internet connection is required (Firebase services)
* If any error occurs, restart the server

---

## 💡 Need Help?

If you face any issues during setup, feel free to reach out.

---

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

/* ================= COMPONENT ================= */

export default function ProfileModal({
  open,
  onOpenChange,
  userData,
}: any) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    coverImage: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        description: userData.description || "",
        phone: userData.phone || "",
        address: userData.address || "",
        coverImage: userData.coverImage || "",
      });
    }
  }, [userData]);

  /* ================= CHANGE ================= */

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) return;

    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...form,
      });

      alert("Profile updated ✅");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLOSE ================= */

  if (!open) return null;

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Business Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          <Input
            name="name"
            placeholder="Business Name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="description"
            placeholder="About your business"
            value={form.description}
            onChange={handleChange}
          />

          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <Input
            name="coverImage"
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={handleChange}
          />

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
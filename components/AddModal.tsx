"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

/* ================= TYPES ================= */

type Field = {
  name: string;
  label: string;
  placeholder: string;
};

type AddModalProps = {
  title: string;
  fields: Field[];
  triggerText: React.ReactNode;
  onSubmit?: (data: Record<string, string>) => void;
};

/* ================= COMPONENT ================= */

export default function AddModal({
  title,
  fields,
  triggerText,
  onSubmit,
}: AddModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    onSubmit?.(formData);

    setFormData({});
    setOpen(false);
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      {/* ✅ NO asChild (FIXED) */}
      <DialogTrigger className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-black text-white hover:opacity-90 transition">
        {triggerText}
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {field.label}
                </label>

                <Input
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}

            <Button className="w-full" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current < end) {
    const hh = current.getHours().toString().padStart(2, "0");
    const mm = current.getMinutes().toString().padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}
